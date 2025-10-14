from database.mongodb import usuarios_collection
from schemas import DadosUsr
from utils.hash import hash_pass
from utils.reset import criar_token, verifica_token


def criar_usuario(data: DadosUsr):

    usr_data = ler_usuario(data.email_usuario)
    if not usr_data:
        usr_data = data.model_dump()
        usr_data["email"] = usr_data.pop("email_usuario")
        usr_data.pop("senha_usuario")
        hash_senha = hash_pass(data.senha_usuario)
        usr_data.update({"senha_hash": hash_senha})
        if usuarios_collection is not None:
            usuario = usuarios_collection.insert_one(usr_data)
            id_usuario = str(usuario.inserted_id)
            usr_data["_id"] = id_usuario
        return "Cadastro feito com sucesso", usr_data
    return "Já existe cadastro nesse email", usr_data


def ler_usuario(email_usuario: str):
    if usuarios_collection is None:
        return None
    usuario = usuarios_collection.find_one({"email": f"{email_usuario}"})
    if usuario:
        usuario["_id"] = str(usuario["_id"])
    return usuario


def solicitar_recuperacao(email_usuario: str):
    usuario = ler_usuario(email_usuario)
    if not usuario:
        return "Usuário não existe", usuario
    token = criar_token(email_usuario)
    usuarios_collection.update_one({"email": email_usuario}, {"$set": {"token": token}})
    return "Solicitação feita com sucesso", email_usuario


def mudar_senha(token: str, senha_nova: str):
    email = verifica_token(token)
    if not email:
        return "Token incorreto"
    if usuarios_collection.find_one({"email": email, "token": token}):
        senha_nova = hash_pass(senha_nova)
        usuarios_collection.update_one(
            {"email": email}, {"$set": {"senha_hash": senha_nova}, "$unset": {"token": token}}
        )
        return "Senha alterada com sucesso"
    return "Não foi possivel alterar a senha"
