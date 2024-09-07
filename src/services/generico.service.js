import jwt from "jsonwebtoken";

async function retornoInsert(id, nivel, usuario, nome, status) {
  let objetoRetorno;
  if (status === "ok") {
    objetoRetorno = {
      status: "ok",
      dados: {
        idusuario: id,
        idnivel: nivel,
        usuario: usuario,
        nome: nome,
      },
    };
  } else {
    objetoRetorno = {
      status: "erro",
      dados: {
        info: "Registro já existe.",
      },
    };
  }
  return objetoRetorno;
}

async function retornoUpdate(id, obs, alteracao, status) {
  let objetoRetorno;
  if (status === "ok") {
    objetoRetorno = {
      status: "ok",
      dados: {
        idusuario: id,
        info: obs,
        linhasalteradas: alteracao,
      },
    };
  } else {
    objetoRetorno = {
      status: "erro",
      dados: {
        idusuario: id,
        info: obs,
        linhasalteradas: alteracao,
      },
    };
  }
  return objetoRetorno;
}

async function retornoDelete(id, obs, alteracao, status) {
  let objetoRetorno;
  if (status === "ok") {
    objetoRetorno = {
      status: "ok",
      dados: {
        idusuario: id,
        info: obs,
        linhasalteradas: alteracao,
      },
    };
  } else {
    objetoRetorno = {
      status: "erro",
      dados: {
        info: obs,
      },
    };
  }
  return objetoRetorno;
}

// Função para cadastro do token
async function criarToken(user) {
  const usuario = user.shift(); //transformar o array em um único objeto

  // Payload do token
  const payload = {
    id: usuario.id,
    usuario: usuario.usuario,
    nome: usuario.nome,
    role: "", // Papel ou permissões do usuário
    email: "", // Outras informações não sensíveis
    // Outras informações que você pode querer incluir
  };

  // Opções para o token
  const options = {
    algorithm: "HS256", // Define o algoritmo de assinatura
    expiresIn: "1h", // Tempo de expiração do token
  };

  // Monta token
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

// Função para verificação do token recebido.
async function auth(req, res, next) {
  const token_header = req.headers["authorization"];

  if (!token_header) return res.status(400).send({ erro: "Informe um Token válido!" });

  // Remover o prefixo 'Bearer ' do token
  const token = token_header.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ erro: "Informe um Token válido!" });
    return next();
  });
}

export default {
  retornoInsert,
  retornoUpdate,
  retornoDelete,
  criarToken,
  auth,
};
