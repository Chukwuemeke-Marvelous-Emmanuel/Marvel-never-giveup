const menuToggle = document.getElementById('menuToggle'), navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', ()=> navLinks.classList.toggle('show'));
const openBtns = [document.getElementById('addNav'), document.getElementById('addMain')];
const modal = document.getElementById('modal'), cancelBtn = document.getElementById('cancelBtn'), saveBtn = document.getElementById('saveBtn');
openBtns.forEach(b => b.addEventListener('click', ()=> modal.classList.add('active')));
cancelBtn.addEventListener('click', ()=> modal.classList.remove('active'));

let properties = [], currentPage = 1;
const grid = document.getElementById('propertyGrid'), pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput'), searchBtn = document.getElementById('searchBtn');
const sortSelect = document.getElementById('sortSelect'), itemsSelect = document.getElementById('itemsSelect');

itemsSelect.addEventListener('change', ()=>{ currentPage = 1; render(); });
searchBtn.addEventListener('click', ()=>{ currentPage = 1; render(); });
sortSelect.addEventListener('change', ()=>{ currentPage = 1; render(); });

saveBtn.addEventListener('click', ()=>{
  const title = document.getElementById('title').value.trim(),
        desc = document.getElementById('description').value.trim(),
        price = document.getElementById('price').value,
        imgFile = document.getElementById('image').files[0],
        vidFile = document.getElementById('video').files[0] || null;
  if(!title||!desc||!price||!imgFile) return alert('Complete required fields.');
  const reader = new FileReader();
  reader.onload = ()=>{
    properties.push({ id: Date.now(), title, desc, price, imgURL: reader.result, vidURL: vidFile? URL.createObjectURL(vidFile): null });
    modal.classList.remove('active'); clearForm(); render();
  };
  reader.readAsDataURL(imgFile);
});

function getFiltered(){
  let list = [...properties];
  const term = searchInput.value.toLowerCase();
  if(term) list = list.filter(p => p.title.toLowerCase().includes(term) || p.price.includes(term));
  const [key,order] = sortSelect.value.split('-');
  if(key){ list.sort((a,b)=>{ if(key==='price') return order==='asc'? a.price - b.price : b.price - a.price; const cmp = a.title.localeCompare(b.title); return order==='asc'? cmp : -cmp; }); }
  return list;
}

function render(){
  const filtered = getFiltered();
  const rawItems = itemsSelect.value;
  const itemsPerPage = rawItems === 'all'? filtered.length : parseInt(rawItems,10);
  const total = itemsPerPage ? Math.ceil(filtered.length / itemsPerPage) : 1;
  if(currentPage > total) currentPage = total || 1;
  grid.innerHTML = '';
  const start = (currentPage - 1) * itemsPerPage;
  const end = rawItems === 'all'? filtered.length : start + itemsPerPage;
  filtered.slice(start, end).forEach(p => {
    const card = document.createElement('div'); card.className = 'card';
    card.innerHTML = `
      <img src="${p.imgURL}" alt>
      <div class="card-content">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="price">$${p.price}</div>
      </div>
      <div class="card-actions">
        <button class="buy">Buy</button>
        <button class="remove">Remove</button>
      </div>`;
    card.querySelector('.buy').onclick = ()=> alert(`Purchased ${p.title} for $${p.price}`);
    card.querySelector('.remove').onclick = ()=>{ properties = properties.filter(x => x.id !== p.id); render(); };
    grid.appendChild(card);
  });
  renderPagination(total, rawItems === 'all');
}

function renderPagination(total, hide){
  pagination.innerHTML = ''; if(hide) return;
  for(let i = 1; i <= total; i++){
    const btn = document.createElement('button'); btn.textContent = i;
    btn.className = i === currentPage ? 'active' : '';
    btn.onclick = ()=>{ currentPage = i; render(); };
    pagination.appendChild(btn);
  }
}

function clearForm(){ ['title','description','price','image','video'].forEach(id => document.getElementById(id).value = ''); }

render();