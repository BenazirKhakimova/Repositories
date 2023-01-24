const input = document.querySelector('.search__inp');
const searchList = document.querySelector('.autocom-box');
const repositoriesList = document.querySelector('.repositories');

function getRepo(e, cb) {
	let eventValue = e.target.value.trim().toLowerCase();
	console.log(eventValue);
	if (eventValue.length > 0) {
		return Promise.resolve().then(() => {
			fetch(`https://api.github.com/search/repositories?q=${eventValue}&per_page=5`, {
				headers: {
					Accept: 'application/vnd.github+json',
				},
			})
				.then((res) => res.json())
				.then((repo) => {
					repo.items.forEach((item) => cb(item));
				});
		});
	} else {
		searchList.classList.remove('show');
	}
}

function debaunce(cb, ms) {
	let clearId;
	return function (...args) {
		clearTimeout(clearId);
		setTimeout(() => cb.apply(this, args), ms);
	};
}
getRepo = debaunce(getRepo, 400);
input.addEventListener('keyup', (e) => {
	getRepo(e, createFoundRepo);
});

function createFoundRepo(repo) {
	let li = document.createElement('li');
	li.classList.add('autocom-item');
	li.textContent = repo.name;
	searchList.classList.add('show');
	searchList.insertAdjacentElement('afterbegin', li);
	addRepo(li, repo);
}

function addRepo(li, item) {
	console.log(item);
	li.addEventListener('click', () => {
		let card = createRepo(item);
		repositoriesList.insertAdjacentElement('afterbegin', card);
		input.value = '';
		searchList.classList.remove('show');
	});
}

function createRepo(item) {
	const card = document.createElement('div');
	card.classList.add('card');
	const div = document.createElement('div');
	const name = document.createElement('p');
	name.textContent = `Name: ${item.name}`;
	const owner = document.createElement('p');
	owner.textContent = `Owner: ${item.owner.login}`;
	const stars = document.createElement('p');
	stars.textContent = `Stars: ${item.stargazers_count}`;
	const button = document.createElement('button');
	button.classList.add('btn-delete');
	const icon = document.createElement('img');
	div.appendChild(name);
	div.appendChild(owner);
	div.appendChild(stars);
	icon.src = './close.svg';
	button.appendChild(icon);
	card.appendChild(div);
	card.appendChild(button);
	deleteRepo(button, card);
	return card;
}
function deleteRepo(button, card) {
	button.addEventListener('click', () => {
		card.remove();
	});
}
