class CatsApi {
constructor(apiName) {
    this.url = `https://cats.petiteweb.dev/api/single/${apiName}`
}
getAllCats() {
    return fetch(`${this.url}/show`)
}

getCurrentCat(id) {
    return fetch(`${this.url}/show/${id}`)
}
addNewCat(data) {
    return fetch(`${this.url}/add`, {
      method: 'POST', 
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(data)  
    })
}
getUpdateCat(id, data) {
    return fetch(`${this.url}/update/${id}`, {
        method: 'PUT', 
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(data)  
      })
}
deleteCat(id) {
    return fetch(`${this.url}/delete/${id}`, {method: 'DELETE'})
}
}

const dbName = 'wuderwuds';
const api = new CatsApi(dbName);