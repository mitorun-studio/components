<?php
// Это PHP-конфиг от MaxGraph с небольшими изменениями (улучшениями?): Добавлена строка №13: $body = ""; Удалил повторяющийся тайтл $title. Вероятно нужно закомментировать переменные отправки файлов №10: $file = $_FILES['file']; и ниже код прикрепления файлов №51.

// Файлы phpmailer:
require 'PHPMailer.php';
require 'SMTP.php';
require 'Exception.php';

// Формирование самого письма:
//$file = $_FILES['file'];// это и код ниже нужно включить если нужна отправка файлов.
$c = true;
$title = "Письмо из IpBro";
$body = "";
foreach ( $_POST as $key => $value ) {
	if ( $value != "" && $key != "project_name" && $key != "admin_email" && $key != "form_subject" ) {
		$body .= "
		" . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
			<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
			<td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
		</tr>
		";
	}
}

$body = "<table style='width: 100%;'>$body</table>";

// Настройки PHPMailer:
$mail = new PHPMailer\PHPMailer\PHPMailer();

try {
	$mail->isSMTP();
	$mail->CharSet    = "UTF-8";
	$mail->SMTPAuth   = true;
	//$mail->SMTPDebug = 2;
	//$mail->Debugoutput = function($str, $level) {$GLOBALS['status'][] = $str;};

	// Настройки вашей почты:
	$mail->Host       = 'smtp.gmail.com';// SMTP сервера вашей почты. Яндекс: smtp.yandex.ru ssl 465 Мейл.ру: smtp.mail.ru ssl 465
	$mail->Port       = 465;
	$mail->SMTPSecure = 'ssl';
	$mail->Username   = 'bearru@gmail.com';// Логин на почте my@example.com
	$mail->Password   = 'zzpklurylczpgsdw';// Пароль ПРИЛОЖЕНИЯ на почте (его нужно получить-запросить специально)
	$mail->setFrom('bearru@gmail.com', 'Заявка с IpBro');// Адрес и имя отправителя.

	// Заполнить емейл(-ы) куда будут приходить письма:
	$mail->addAddress('contact@mitorun.studio');
	//$mail->addAddress('mail@example.com');

	// Прикрипление файлов к письму:
	//if (!empty($file['name'][0])) {
	//	for ($ct = 0; $ct < count($file['tmp_name']); $ct++) {
	//		$uploadfile = tempnam(sys_get_temp_dir(), sha1($file['name'][$ct]));
	//		$filename = $file['name'][$ct];
	//		if (move_uploaded_file($file['tmp_name'][$ct], $uploadfile)) {
	//				$mail->addAttachment($uploadfile, $filename);
	//				$rfile[] = "Файл $filename прикреплён";
	//		} else {
	//				$rfile[] = "Не удалось прикрепить файл $filename";
	//		}
	//	}
	//}

	// Отправка сообщения:
	$mail->isHTML(true);
	$mail->Subject = $title;
	$mail->Body = $body;
	$mail->send();
} catch (Exception $e) {
	$status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}

// Отображение результата:
//echo json_encode(["result" => $result, /*"resultfile" => $rfile,*/ "status" => $status]);
