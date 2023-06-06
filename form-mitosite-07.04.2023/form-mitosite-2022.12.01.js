//------------------------------------------------
//--- Скрипты для формы связи form-mitosite: -----
//- Маска, прикрепление файлов и обработка формы -
//------------------------------------------------





//------------------------------------------------
//-------- Маска для телефона phoneinput: --------
//------------------------------------------------

// https://github.com/alexey-goloburdin/phoneinput
// Для использования нужно для инпута задать отрибут "data-tel-input"

document.addEventListener("DOMContentLoaded", function () {
	var phoneInputs = document.querySelectorAll('input[data-tel-input]');

	var getInputNumbersValue = function (input) {
		// Return stripped input value — just numbers
		return input.value.replace(/\D/g, '');
	}

	var onPhonePaste = function (e) {
		var input = e.target,
			inputNumbersValue = getInputNumbersValue(input);
		var pasted = e.clipboardData || window.clipboardData;
		if (pasted) {
			var pastedText = pasted.getData('Text');
			if (/\D/g.test(pastedText)) {
				// Attempt to paste non-numeric symbol — remove all non-numeric symbols,
				// formatting will be in onPhoneInput handler
				input.value = inputNumbersValue;
				return;
			}
		}
	}

	var onPhoneInput = function (e) {
		var input = e.target,
			inputNumbersValue = getInputNumbersValue(input),
			selectionStart = input.selectionStart,
			formattedInputValue = "";

		if (!inputNumbersValue) {
			return input.value = "";
		}

		if (input.value.length != selectionStart) {
			// Editing in the middle of input, not last symbol
			if (e.data && /\D/g.test(e.data)) {
				// Attempt to input non-numeric symbol
				input.value = inputNumbersValue;
			}
			return;
		}

		if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
			if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
			var firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
			formattedInputValue = input.value = firstSymbols + " ";
			if (inputNumbersValue.length > 1) {
				formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
			}
			if (inputNumbersValue.length >= 5) {
				formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
			}
			if (inputNumbersValue.length >= 8) {
				formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
			}
			if (inputNumbersValue.length >= 10) {
				formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
			}
		} else {
			formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
		}
		input.value = formattedInputValue;
	}
	var onPhoneKeyDown = function (e) {
		// Clear input after remove last symbol
		var inputValue = e.target.value.replace(/\D/g, '');
		if (e.keyCode == 8 && inputValue.length == 1) {
			e.target.value = "";
		}
	}
	for (var phoneInput of phoneInputs) {
		phoneInput.addEventListener('keydown', onPhoneKeyDown);
		phoneInput.addEventListener('input', onPhoneInput, false);
		phoneInput.addEventListener('paste', onPhonePaste, false);
	}
})

//--- Конец маски для телефона phoneinput. -------








//------------------------------------------------
//-------- Скрипт для загрузки файлов от MDN: ----
//------------------------------------------------

const fileInput = document.querySelector('#file');
const fileList = document.querySelector('#file-list');
fileInput.addEventListener('change', updateFileList);

function updateFileList() {
	while (fileList.firstChild) {
		fileList.removeChild(fileList.firstChild);
	}

	let curFiles = fileInput.files;

	if (!(curFiles.length === 0)) {
		console.log('test');
		for (let i = 0; i < curFiles.length; i++) {
			const listItem = document.createElement('li');
			listItem.textContent = 'File name: ' + curFiles[i].name + '; file size ' + returnFileSize(curFiles[i].size) + '.';
			fileList.appendChild(listItem);
		}
	}
}

function returnFileSize(number) {
	if (number < 1024) {
		return number + 'bytes';
	} else if (number >= 1024 && number < 1048576) {
		return (number / 1024).toFixed(1) + 'KB';
	} else if (number >= 1048576) {
		return (number / 1048576).toFixed(1) + 'MB';
	}
}

//-------- Конец скрипта для загрузки файлов. ----








//------------------------------------------------
//--- Скрипт для отправки формы на емейл: --------
//------------------------------------------------
// Скрипт для формы связи от К.Болдырев №3 01.12.2022
// Этот скрипт отправляет письма с PHP-конфигом PHPMailer от MaxGraph.

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
const form = document.querySelector('#form');
form.addEventListener('submit', formSubmit);


// Инициализация второй формы:
const form2 = document.querySelector('#form-2');
form2.addEventListener('submit', formSubmit);

//--- Конец скрипта для отправки формы на емейл: -








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
