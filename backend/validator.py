# required_fields tableau de tuple [(nomchamp,type),(nomchamp,type),...]
def verifyBody(data, required_fields):
    if (not data):
        return [False, "Body vide"]
    if (len(data) != len(required_fields)):
        return [False, "Longueur body incorrect"]
    for required_field in required_fields:
        body_property = data.get(required_field[0])
        if (not body_property or not type(body_property) is required_field[1]):
            return [False, f"Champ {required_field[0]} requis"]
    return [True]
