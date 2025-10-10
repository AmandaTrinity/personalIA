from database.mongodb import usuarios_collection
from schemas import DadosUsr


def criar_usuario(data: DadosUsr):

    usr_data = ler_usuario(data.email_usuario)
    if not usr_data:
        usr_data = {
            "email": data.email_usuario,
            "nome": data.nome_usuario,
            "idade": data.idade_usuario,
            "peso": data.peso_usuario,
            "altura": data.altura_usuario,
            "limitação": data.limitacoes_usuario,
            "dias_semana": data.dias_usuario,
            "tempo_diario": data.minutos_usuario,
            "local_treino": data.lugar_usuario,
        }
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
