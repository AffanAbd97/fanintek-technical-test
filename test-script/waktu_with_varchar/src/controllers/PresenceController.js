const prisma = require("../prisma");
const { format } = require("date-fns");
const { convertDateFormat } = require("../utils/helper");

const create = async (req, res) => {
  const { userId } = req.user;
  const { waktu, type } = req.body;
  const [datePart, timePart] = waktu.split(" ");

  const [year, month, day] = datePart.split("-");

  const [hours, minutes, seconds] = timePart.split(":");
  const parsedDate = new Date(year, month - 1, day, hours, minutes, seconds);
  const adjustedDate = new Date(parsedDate.getTime());

  if (isNaN(adjustedDate)) {
    return res.status(400).json({ error: "Invalid datetime format for waktu" });
  }
  const formattedDate = format(adjustedDate, "dd/MM/yy HH:mm");
  const date = formattedDate.split(" ")[0];
  const hour = formattedDate.split(" ")[1];

  try {
    const dataExist = await prisma.eppresence.findMany({
      where: {
        id_users: userId,
        type,
        waktu: {
          startsWith: date,
        },
      },
    });
    // res.send(dataExist)
    if (dataExist.length > 0) {
      return res.status(400).json({ error: "Presence Already Exist" });
    }
    if (type == "OUT") {
      const dataIN = await prisma.eppresence.findFirst({
        where: {
          id_users: userId,
          type: "IN",
          waktu: {
            startsWith: date,
          },
        },
      });

      const dateIn = dataIN.waktu.split(" ")[1];
      const hourIn = parseInt(dateIn.split(":"));
      const hourOut = parseInt(hour.split(":"));
      if (hourIn >= hourOut) {
        return res.status(400).send({
          message: "OUT Hour Not Valid",
        });
      }
    }
    await prisma.eppresence.create({
      data: {
        type: type,
        waktu: formattedDate,
        id_users: userId,
      },
    });

    return res.status(200).send({
      message: "Insert Epresence Sucess",
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      return res.status(500).json({ error });
    }
  }
};
const update = async (req, res) => {
  const { id: presenceId } = req.params;
  const { userId } = req.user;
  const { is_approve } = req.body;
  if (!presenceId) {
    return res.status(400).json({ error: "Presence ID not Provided" });
  }

  try {
    const isSuperVisor = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (isSuperVisor.npp_supervisor != null) {
      return res.status(401).send({ isSuperVisor, message: "Unauthorized" });
    }

    const userPresence = await prisma.eppresence.findFirst({
      where: {
        id: parseInt(presenceId),
      },
      include: {
        user: true,
      },
    });
    if (!userPresence) {
      return res.status(404).send({
        message: "Data Not Found",
      });
    }
    if (userPresence.user.npp_supervisor != isSuperVisor.npp) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
    await prisma.eppresence.update({
      where: {
        id: parseInt(presenceId),
      },
      data: {
        is_approve,
      },
    });
    return res.status(200).send({
      message: "Update Epresence Sucess",
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      return res.status(500).json({ error });
    }
  }
};
const getData = async (req, res) => {
  try {
    const { userId } = req.user;

    const queryIN = await prisma.eppresence.findMany({
      where: {
        id_users: userId,
        type: "IN",
      },
      include: {
        user: true,
      },
    });

    const queryOUT = await prisma.eppresence.findMany({
      where: {
        id_users: userId,
        type: "OUT",
      },
      include: {
        user: true,
      },
    });

    const data = [];

    queryIN.forEach((itemIN) => {
      const dateIN = itemIN.waktu.split(" ")[0];

      const record = {
        id_user: itemIN.id_users,
        nama_user: itemIN.user.nama,
        tanggal: convertDateFormat(dateIN),
        waktu_masuk: itemIN.waktu.split(" ")[1],
        waktu_pulang: null,
        status_masuk: itemIN.is_approve ? "APPROVE" : "REJECT",
        status_pulang: null,
      };

      queryOUT.forEach((itemOUT) => {
        const dateOUT = itemOUT.waktu.split(" ")[0];

        if (dateIN === dateOUT) {
          record.waktu_pulang = itemOUT.waktu.split(" ")[1];
          record.status_pulang = itemOUT.is_approve ? "APPROVE" : "REJECT";
        }
      });

      data.push(record);
    });

    return res.status(200).json({
      message: "Success get data",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { create, update, getData };
