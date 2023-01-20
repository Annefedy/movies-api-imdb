const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../../models/User.js");
const mailerAuth = require("../../config/mailer");
var saltRounds = bcrypt.genSaltSync(10);

//verifique se o usuário está logado
router.get("/isloggedin", async (req, res) => {
  if (!req.session.user) {
    return res.status(403).send({ response: "Não logado" });
  }
  return res
    .send({ user: req.session.user, response: "É Valido" });
});

//obter informações do usuário logado
router.get("/", async (req, res) => {
  if (req.session.user) {
    try {
      const user = await User.query()
        .select("id", "username", "email")
        .findById(req.session.user.id);
      return res.json(user);
    } catch (error) {
      return res
        .status(500)
        .send({ response: "algo deu errado no banco de dados" });
    }
  } else {
    return res.status(404).send({ response: "Não logado" });
  }
});

// registrar usuário
router.post("/register", async (req, res, next) => {
  const { username, email, password, confirm_password } = req.body;

  if (!username || !email || !password || !confirm_password) {
    return res.status(400).send({ response: "campos ausentes" });
  }

  if (password && password.length < 8) {
    return res
      .status(400)
      .send({ response: "a senha não atende aos requisitos" });
  }

  if (password !== confirm_password) {
    return res.status(400).send({ response: "As senhas não coincidem" });
  }

  if (username && email) {
    const userExists = await User.query()
      .where("username", username)
      .orWhere("email", email);

    if (userExists.length) {
      return res
        .status(400)
        .send({ response: "nome de usuário ou e-mail já existe" });
    }
  }

  bcrypt.hash(password, saltRounds, async (error, hashedPassword) => {
    if (error) {
      return res.status(500).send({ response: "erro ao criar usuario" });
    }

    try {
      const user = await User.query().insert({
        username,
        email,
        password: hashedPassword,
      });
      return res.status(200).send({ user, response: "user created" });
    } catch (err) {
      next(err);
    }
  });
});

// Conexão
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    const users = await User.query()
      .select()
      .where({ username: username })
      .limit(1);
    const user = users[0];

    if (!user) {
      return res.status(404).send({ response: "Nome de usuário ou senha incorretos" });
    }

    bcrypt.compare(password, user.password, (error, isSame) => {
      if (error) {
        return res.status(500).send({});
      }
      if (!isSame) {
        return res.status(404).send({ response: "Nome de usuário ou senha incorretos" });
      } else {
        req.session.user = { username: user.username, id: user.id };
        return res
          .status(200)
          .send({ username: user.username, session: req.session.user });
      }
    });
  } else {
    return res.status(404).send({ response: "Nome de usuário ou senha ausente" });
  }
});

// sair
router.get("/logout", async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).send({ response: "não foi possível sair" });
    } else {
      return res.status(200).send({ response: "desconectado com sucesso" });
    }
  });
});

// deletar usuário
router.delete("/", async (req, res) => {
  if (req.session.user) {
    const deleteUser = await User.query().deleteById(req.session.user.id);
    if (deleteUser) {
      req.session.destroy();
      return res.status(200).send({ response: "Usuário excluído com sucesso" });
    } else {
      return res.status(404).send({ response: "não foi possível excluir o usuário" });
    }
  } else {
    return res.status(403).send({ response: "Não está logado" });
  }
});

// editar usuário
router.put("/:id", async (req, res) => {
  const user = await User.findById(req.session.user.id);
  if (user) {
    user.username = req.body.name || user.username;
    user.email = req.body.email || user.email
    const updateUser = await user.save();
    res.json({
      id: updateUser.id,
      username: updateUser.username,
      email: updateUser.email
    })
  }else {
    res.status(404).json({
      sucess: false,
      msg: "não foi possível atualizar o usuário" 
  });
  }
});

// forgot password request
router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;
  const user = await User.query().findOne({ email: email });

  if(!email) {
    res.status(400).send({ response: 'Missing fields' });
  }

  if(!user) {
    res.status(404).send({ response: 'The email does not exist in the database' });
  } else {
    let recovery_link = crypto.randomBytes(16).toString("hex");
    await User.query().patch({
      recovery_link,
      recovery_link_status: true
    }).findById(user.id);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mailerAuth.user,
        pass: mailerAuth.password
      }
    });

    const mailOptions = {
      from: mailerAuth.user,
      to: email,
      subject: "Password reset",
      html: `<a href="http://localhost:3000/passwordreset/${user.id}/${recovery_link}">Click here to change your password.</a>`
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if(error) {
        res.status(502).send({
          response: "Email not sent",
          error: error.message
        })
      } else {
        return res.status(200).send({ response: "email sent" });
      }
    })
  }
})

// redefinir senha
router.post("/passwordreset", async (req, res) => {
  const { id, recoveryLink, newPassword, confirmNewPassword } = req.body;

  if (id && recoveryLink) {
    const user = await User.query().findById(id);
    if(!user) {
      return res.status(404).send({ response: "Usuário não existe" });
    }

    if (newPassword && newPassword.length < 8) {
      return res
        .status(400)
        .send({ response: "a senha não atende aos requisitos" });
    }

    if(newPassword && confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        return res.status(400).send({ response: "As senhas não coincidem" });
      }
    } else {
      return res.status(400).send({ response: "campos ausentes" });
    }
    if(recoveryLink !== user.recovery_link || user.recovery_link_status == 0) {
      return res.status(400).send({ response: "Token de recuperação inválido" });
    }

    bcrypt.hash(newPassword, saltRounds, async(error, hashedPassword) => {
      if (error) {
        return res.status(500).send({ response: "A senha não pôde ser atualizada" });
      }

      try {
        await user.$query().patch({
          password: hashedPassword,
          recovery_link_status: false
        })

        return res.send({ response: "Senha mudada com sucesso" });
      } catch(error) {
        return res.status(500).send({ response: "Algo deu errado no banco de dados" });
      }

    })
  
  } else {
    return res.status(404).send({ response: "id ou link de recuperação ausente" });
  } 
})



module.exports = router;