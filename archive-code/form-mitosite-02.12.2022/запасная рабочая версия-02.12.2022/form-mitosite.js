// Скрипт для формы связи от К.Болдырев №3 01.12.2022
// Этот скрипт отправляет письма с PHP-конфигом PHPMailer от MaxGraph.


// Скрипт для отправки формы на емейл:
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

		if (response.ok) {
			formSuccessMessage.classList.add('active');
			form.reset();
		} else {
			console.error('Ошибка HTTP:', response.status);
			formErrorMessage.classList.add('active');
		}
	} catch (error) {
		console.error('Ошибка:', error);
		formErrorMessage.classList.add('active');
	}
}

// Инициализация формы (без валидации):
const form = document.querySelector('.form');
form.addEventListener('submit', formSubmit);


// Инициализация второй формы:
//const form2 = document.querySelector('.form-2');
//form2.addEventListener('submit', formSubmit);





// Подключение валидации с библиотекой just-validate:
//const validation = new JustValidate('.form');
//validation
//	/*.addField('#formName', [
//		{
//			rule: 'minLength',
//			value: 3,
//			errorMessage: 'Минимум 3 символа',
//		},
//		{
//			rule: 'maxLength',
//			value: 30,
//			errorMessage: 'Максимум 30 символов',
//		},
//		{
//			rule: 'required',
//			value: true,
//			errorMessage: 'Введите имя'
//		}
//	])*/
//	.addField('#formEmail', [
//		{
//			rule: 'required',
//			value: true,
//			errorMessage: 'Email обязателен',
//		},
//		{
//			rule: 'email',
//			value: true,
//			errorMessage: 'Введите корректный Email',
//		},
//	])
//	/*.addField('#formTel', [
//		{
//			rule: 'required',
//			value: true,
//			errorMessage: 'Телефон обязателен',
//		},
//		{
//			rule: 'function',
//			validator: function() {
//				const phone = telSelector.inputmask.unmaskedvalue();
//				return phone.length === 10;
//			},
//			errorMessage: 'Введите корректный телефон',
//		},
//	])*/
//	.onSuccess((event) => formSubmit(event));
