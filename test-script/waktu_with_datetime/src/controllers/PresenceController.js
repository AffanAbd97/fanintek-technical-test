const prisma = require("../prisma");
const { format } = require("date-fns");
const { fromZonedTime, toZonedTime } = require("date-fns-tz");

const timeZone = "Asia/Jakarta";

const create = async (req, res) => {
  const { userId } = req.user;
  const { waktu, type } = req.body;

  const adjustedDate = fromZonedTime(new Date(waktu), timeZone); // GTM +7 TO UTC
  if (isNaN(adjustedDate)) {
    return res.status(400).json({ error: "Invalid datetime format for waktu" });
  }

  try {
    const datePart = format(toZonedTime(adjustedDate, timeZone), "yyyy-MM-dd");  // UTC TO GTM +7 
    const dataExist = await prisma.eppresence.findMany({
      where: {
        id_users: userId,
        type,
        waktu: {
          gte: new Date(`${datePart}T00:00:00`),
          lt: new Date(`${datePart}T23:59:59`),
        },
      },
    });

    if (dataExist.length > 0) {
      return res.status(400).json({ error: "Presence Already Exist" });
    }

    if (type == "OUT") {
      const dataIN = await prisma.eppresence.findFirst({
        where: {
          id_users: userId,
          type: "IN",
          waktu: {
            gte: new Date(`${datePart}T00:00:00`),
            lt: new Date(`${datePart}T23:59:59`),
          },
        },
      });

      if (dataIN) {
        const hourIn = toZonedTime(dataIN.waktu, timeZone).getHours();
        const hourOut = toZonedTime(adjustedDate, timeZone).getHours();
        if (hourIn >= hourOut) {
          return res.status(400).send({
            message: "OUT Hour Not Valid",
          });
        }
      } else {
        return res.status(400).send({
          message: "Have not checked in.",
        });
      }
    }

    await prisma.eppresence.create({
      data: {
        type: type,
        waktu: adjustedDate,
        id_users: userId,
      },
    });

    return res.status(200).send({
      message: "Insert Epresence Success",
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
      message: "Update Epresence Success",
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
      const dateIN = toZonedTime(itemIN.waktu, timeZone)
        .toISOString()
        .split("T")[0];

      const record = {
        id_user: itemIN.id_users,
        nama_user: itemIN.user.nama,
        tanggal: format(toZonedTime(new Date(dateIN), timeZone), "yyyy-MM-dd"),
        waktu_masuk: format(toZonedTime(itemIN.waktu, timeZone), "HH:mm:ss"),
        waktu_pulang: null,
        status_masuk: itemIN.is_approve ? "APPROVE" : "REJECT",
        status_pulang: null,
      };

      queryOUT.forEach((itemOUT) => {
        const dateOUT = toZonedTime(itemOUT.waktu, timeZone)
          .toISOString()
          .split("T")[0];

        if (dateIN === dateOUT) {
          record.waktu_pulang = format(
            toZonedTime(itemOUT.waktu, timeZone),
            "HH:mm:ss"
          );
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
