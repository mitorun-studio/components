/* Скрипт для формы связи от К.Болдырев №1 2022. */
/* Этот скрипт отправляет письма, но не работает нормально с PHP-конфигом PHPMailer от MaxGraph */


// Функция для отправки формы:
const formSubmit = async (event) => {
	event.preventDefault();

	const form = event.target;
	const formData = new FormData(form);
	const url = form.getAttribute('action');
	const method = form.getAttribute('method');
	const formSuccessMessage = form.querySelector('.form__success');
	const formErrorMessage = form.querySelector('.form__failure');

	try {
		const response = await fetch(url, {
			method: method,
			body: formData
		});
		const result = await response.json();

		console.log('Успех:', JSON.stringify(result));
		formSuccessMessage.classList.add('active');
		form.reset();
	} catch (error) {
		console.error('Ошибка:', error);
		formErrorMessage.classList.add('active');
	}
}
// Конец подключения и настройки формы связи.




// Пример использования функции с обычной формой:
//const form2 = document.querySelector('.form-2');
//form2.addEventListener('submit', formSubmit);
