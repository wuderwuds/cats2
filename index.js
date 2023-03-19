const $wrapper = document.querySelector('[data-wr]')
const $addBtn = document.querySelector('[data-add_button]')
const $modalAdd = document.querySelector('[data-modal]')
const $modalClose = document.querySelector('[data-modal_close]')
const $formErrorMsg = document.querySelector('[data-errmsg]')
const $idRndm = document.querySelector('[data-id]')
const $catInfo = document.querySelector('[data-info]')







const generateCatCard = (cat) => {
  return (`
<div data-card_id=${cat.id} class="card bg-info" style="width: 18rem;">
  <img src="${cat.image}" class="card-img-top" alt="фото не загрузилось">
  <div class="card-body">
    <h5 class="card-title">${cat.name}</h5>
   <button type="button"  data-action="open" class="btn btn-primary">Open</button>
    <button type="button" data-action="edit"  class="btn btn-warning">Edit</button>
    <button type="button"  data-action="delete"  class="btn btn-danger">Delete</button>
  </div>
</div> `
  )
}

const generateCatCardInfo = (cat) => {
  return (`
  <div  data-cat_info=${cat.id} class="card" style="width: 18rem;">
  <div class="modal-header">
      <h8 class="modal-title p-2">Info Cat</h8>
      <button type="button"  class="btn-close p-2" data-action="close"></button>
    </div>
<img src="${cat.image}" class="card-img-top" alt="...">
<div class="card-body">
<h5 class="card-title" data-name_info> name: ${cat.name}</h5>
<h5 class="card-title">age: ${cat.age}  </h5>
<h5 class="card-title">rate: ${cat.rate} </h5>
<h5 data-favorite class="card-title"> </h5>
<p class="card-text"> ${cat.description}
</p>
<button type="button"  data-action="update" class="btn btn-primary">Update</button>
</div>
</div> `
  )
}

const showAllCats = async () => {
  const res = await api.getAllCats();

  if (res.status !== 200) {
    const errorMessage = document.createElement('p')
    errorMessage.classList.add('error-msg')
    errorMessage.innerText = 'Произошла ошибка, попробуйте позже'
    return $wrapper.appendChild(errorMessage)
  }

  const data = await res.json();
  console.log(data);
  if (data.length === 0) {
    const notificationMessage = document.createElement('p')
    notificationMessage.innerText = 'Список котов пуст, добавьте новых котов'
    return $wrapper.appendChild(notificationMessage)
  }

  data.forEach(cat => {
    $wrapper.insertAdjacentHTML('afterbegin', generateCatCard(cat))
  });
}
showAllCats()

$wrapper.addEventListener('click', async (event) => {  
  if(event.target.closest('[data-card_id]')) {

  // console.log(event.target.dataset.action);
  const action = event.target.dataset.action;
  const $cardCat = event.target.closest("[data-card_id]");
  const catId = $cardCat.dataset.card_id; 
  //console.log(catId);
  
  switch (action) {
    case 'delete':

      try {
        const res = await api.deleteCat(catId);
        const responce = await res.json();
        //console.log(responce);
        //alert(responce.messsage);
        if (!res.ok) throw Error(responce.message)
        $cardCat.remove()
      } catch (error) {
        console.log(error)
      }

      break;


    case 'open':
      try {

        $catInfo.classList.remove('hidden-info');
        $catInfo.addEventListener('click', (event) => {


          if (!event.target.closest('.card')) {
            $catInfo.replaceChildren()
            $catInfo.classList.add('hidden-info');

          }
        })
        const res = await api.getCurrentCat(catId);
        const data = await res.json();
        console.log(data);



        $catInfo.insertAdjacentHTML('afterbegin', generateCatCardInfo(data))
        if (data.favorite === true) {
        const $dataFavorite = document.querySelector('[data-favorite]')
        $dataFavorite.innerHTML = '<i class="fa-solid fa-heart"></i>'
        }



        if (!res.ok) throw Error(data.message)
      }
      catch (error) {
        console.log(error)
      }

      break;



    default:
      break;
  }



}})


$addBtn.addEventListener('click', (event) => {
  const f = Math.random() * 10000;
  const r = Math.floor(f);
  $idRndm.value = r;
  $modalAdd.classList.remove('hidden')
})

$modalClose.addEventListener('click', (event) => {
  $modalAdd.classList.add('hidden');
})
$modalAdd.addEventListener('click', (event) => {


  if (!event.target.closest('.custom-modal')) {
    // $catInfo.replaceChildren()
    $modalAdd.classList.add('hidden');

  }
})


document.forms.add_cats_form.addEventListener('submit', async (event) => {
  event.preventDefault()
 
  //console.log(event.target)
  const data = Object.fromEntries(new FormData(event.target).entries());// объект с тем что в заполеных полях формы 
  console.log(data)


  data.id = +data.id //преобразуем строку в намберs
  data.age = Number(data.age) //преобразуем строку в намбер
  data.rate = Number(data.rate)
  data.favorite = data.favorite ? true : false;   //  data.favorite = !!data.favorite 
  const res = await api.addNewCat(data)
  //console.log(res);
  if (res.ok) {
    $wrapper.replaceChildren(); //очищает врапер от все котов
    showAllCats()
    $modalAdd.classList.add('hidden')
    localStorage.removeItem('formcats')
    return event.target.reset()
  } else {
    const responce = await res.json()
    $formErrorMsg.innerText = responce.message
    return;
  }

  // console.log(responce);
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




const formAddCatLC = localStorage.getItem('formcats');
const parsenData = formAddCatLC ? JSON.parse(formAddCatLC) : null;
if (parsenData) {
  Object.keys(parsenData).forEach(key => {
    document.forms.add_cats_form[key].value = parsenData[key]
  });
}
document.forms.add_cats_form.addEventListener('input', event => {
  const formData = Object.fromEntries(new FormData(document.forms.add_cats_form).entries());
  formData.favorite = formData.favorite ? true : false;
  console.log(formData);
  localStorage.setItem('formcats', JSON.stringify(formData))
})





$catInfo.addEventListener('click', async (event) => {
  
  const action = event.target.dataset.action;

  switch (action) {
    case 'close':

      try {
        $catInfo.replaceChildren()
        $catInfo.classList.add('hidden-info')

      } catch (error) {
        console.log(error)
      }

      break;

    default:
      break;
  }
})
