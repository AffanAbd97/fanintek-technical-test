const prisma = require("../prisma");

const create = async (req, res) => {
  const { userId } = req.user;
  const { waktu, type } = req.body;
  if (isNaN(Date.parse(waktu))) {
    return res.status(400).json({ error: "Invalid datetime format for waktu" });
  }
  try {
    await prisma.eppresence.create({
      data: {
        type: type,
        waktu: new Date(waktu),
        id_users: userId,
      },
    });

    res.status(200).send({
      message: "Insert Epresence Sucess",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
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
      return res.status(401).send({ isSuperVisor, message: "aadasd" });
    }
   

    const userPresence = await prisma.eppresence.findFirst({
      where: {
        id: parseInt(presenceId),
      },include:{
        user:true
      }
    });
  
    if (userPresence.user.npp_supervisor != isSuperVisor.npp) {
      return res.status(401).send({
        message: "aaaa",
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
    res.status(200).send({
      message: "Update Epresence Sucess",
    });
  } catch (error) {
    res.status(500).json({ error });
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
      const dateIN = itemIN.waktu.toISOString().split("T")[0];

      const record = {
        id_user: itemIN.id_users,
        nama_user: itemIN.user.nama,
        tanggal: dateIN,
        waktu_masuk: itemIN.waktu.toISOString().split("T")[1],
        waktu_pulang: null,
        status_masuk: itemIN.is_approve ? "APPROVE" : "REJECT",
        status_pulang: null,
      };

      queryOUT.forEach((itemOUT) => {
        const dateOUT = itemOUT.waktu.toISOString().split("T")[0];

        if (dateIN === dateOUT) {
          record.waktu_pulang = itemOUT.waktu.toISOString().split("T")[1];
          record.status_pulang = itemOUT.is_approve ? "APPROVE" : "REJECT";
        }
      });

      data.push(record);
    });

    res.status(200).json({
      message: "Success get data",
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { create, update, getData };
