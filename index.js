const $wrapper = document.querySelector('[data-wr]')
const $addBtn = document.querySelector('[data-add_button]')
const $modalAdd = document.querySelector('[data-modal]')
const $modalClose = document.querySelector('[data-modal_close]')





const generateCatCard = (cat) => {
  return (`
<div data-card_id=${cat.id} class="card mx-2" style="width: 18rem;">
  <img src="${cat.image}" class="card-img-top" alt="фото не загрузилось">
  <div class="card-body">
    <h5 class="card-title">${cat.name}</h5>
    <p class="card-text">${cat.description}</p>
    <button type="button"  data-action="open" class="btn btn-primary">Open</button>
    <button type="button" data-action="edit"  class="btn btn-warning">Edit</button>
    <button type="button"  data-action="delete"  class="btn btn-danger">Delete</button>
  </div>
</div> `
  )
}

$wrapper.addEventListener('click',async (event)=>{
  // console.log(event.target.dataset.action);
  const action = event.target.dataset.action;

    switch (action) {
    case 'delete':
    const $cardCat = event.target.closest("[data-card_id]");   
    const catId = $cardCat.dataset.card_id;
      //console.log(catId);
try {
  const res = await api.deleteCat(catId);
  const responce = await res.json();
  //console.log(responce);
  //alert(responce.messsage);
  if(!res.ok) throw Error(responce.message)
  $cardCat.remove() 
} catch (error) {
  console.log(error)
}

      break;
  
    default:
      break;
  }
  
  })


$addBtn.addEventListener('click',(event) => {
$modalAdd.classList.remove('hidden')
})

$modalClose.addEventListener('click',(event)=>{
  $modalAdd.classList.add('hidden')
})



document.forms.add_cats_form.addEventListener('submit',async (event)=>{
event.preventDefault()
//console.log(event.target)
const data = Object.fromEntries(new FormData(event.target).entries());
data.id = Number(data.id)
data.age = Number(data.age)
data.rate = Number(data.rate)
data.favorite = data.favorite ? true : false;
const res = await api.addNewCat(data)
console.log(res);
const responce = await res.json()
event.target.reset()
$modalAdd.classList.add('hidden')
console.log(responce);
})



//----------------------------Promise
/* 
api.getAllCats()
.then(res => {
  console.log({ res });
  return res.json()
})
  .then(data => {
    console.log(data);
    
    data.forEach(cat => {
      $wrapper.insertAdjacentHTML('afterbegin', generateCatCard(cat))
    });
    
})

*/
//=============sugar

const showAllCats = async () => {
  const res = await api.getAllCats();
  
  if (res.status !==200) {
    const errorMessage = document.createElement('p')
    errorMessage.classList.add('error-msg')
    errorMessage.innerText = 'Произошла ошибка, попробуйте позже'
    return $wrapper.appendChild(errorMessage)
  }
   
  const data = await res.json();
  if (data.length===0) {   
    const notificationMessage = document.createElement('p')
    notificationMessage.innerText = 'Список котов пуст, добавьте новых котов'
    return $wrapper.appendChild(notificationMessage)
  }
  
  data.forEach(cat => {
    $wrapper.insertAdjacentHTML('afterbegin', generateCatCard(cat))
  });
} 
showAllCats()