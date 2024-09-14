import jwt from "jsonwebtoken";

 // Função para cadastro do token
async function criarToken(user) {
  const usuario = user.shift(); //transformar o array em um único objeto

  // Payload do token
  const payload = {
    id: usuario.id,
    usuario: usuario.usuario,
    nome: usuario.nome,
    role: "", // Papel ou permissões do usuário
    email: usuario.email, // Outras informações não sensíveis
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

  // Verificar se o token tem o prefixo 'Bearer'
  const token = token_header.startsWith("Bearer ") ? token_header.split(" ")[1] : token_header;

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).send({ erro: "Informe um Token válido!" });
    req.user = user; //armazena as informações do usuário autenticado   
    return next();
  });
}

export default {  
  criarToken,
  auth,
};
