<?php
// Это файл из статьи https://shpaginkirill.medium.com/%D0%B2%D0%BC%D0%B5%D0%BD%D1%8F%D0%B5%D0%BC%D0%B0%D1%8F-%D0%B8%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%86%D0%B8%D1%8F-%D0%BA-phpmailer-%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%B0-%D0%BF%D0%B8%D1%81%D0%B5%D0%BC-%D0%B8-%D1%84%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2-%D0%BD%D0%B0-%D0%BF%D0%BE%D1%87%D1%82%D1%83-b462f8ff9b5c.

// Файлы phpmailer
require 'PHPMailer.php';
require 'SMTP.php';
require 'Exception.php';

// Переменные, которые отправляет пользователь
$text = $_POST['text'];
$email = $_POST['email'];
$message = $_POST['message'];
//$file = $_FILES['myfile'];

// Формирование самого письма
$title = "Заголовок письма";
$body = "
<h2>Новое письмо</h2>
<b>Имя:</b> $text<br>
<b>Почта:</b> $email<br><br>
<b>Сообщение:</b><br>$message
";

// Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer();
try {
	$mail->isSMTP();
	$mail->CharSet = "UTF-8";
	$mail->SMTPAuth   = true;
	//$mail->SMTPDebug = 2;
	$mail->Debugoutput = function($str, $level) {$GLOBALS['status'][] = $str;};

	// Настройки вашей почты
	$mail->Host       = 'smtp.gmail.com'; // SMTP сервера вашей почты
	$mail->Username   = 'bearru@gmail.com'; // Логин на почте
	$mail->Password   = 'zzpklurylczpgsdw'; // Пароль на почте
	$mail->SMTPSecure = 'ssl';
	$mail->Port       = 465;
	$mail->setFrom('bearru@gmail.com', 'Заявка с Mitorun Studio'); // Адрес самой почты и имя отправителя

	// Получатель письма
	$mail->addAddress('contact@mitorun.studio');
	//$mail->addAddress('youremail@gmail.com');

	// Прикрипление файлов к письму
	//if (!empty($file['name'][0])) {
	//	for ($ct = 0; $ct < count($file['tmp_name']); $ct++) {
	//		$uploadfile = tempnam(sys_get_temp_dir(), sha1($file['name'][$ct]));
	//		$filename = $file['name'][$ct];
	//		if (move_uploaded_file($file['tmp_name'][$ct], $uploadfile)) {
	//			$mail->addAttachment($uploadfile, $filename);
	//			$rfile[] = "Файл $filename прикреплён";
	//		} else {
	//			$rfile[] = "Не удалось прикрепить файл $filename";
	//		}
	//	}
	//}

// Отправка сообщения
$mail->isHTML(true);
$mail->Subject = $title;
$mail->Body = $body;

// Проверяем отравленность сообщения
if ($mail->send()) {$result = "success";}
else {$result = "error";}

} catch (Exception $e) {
	$result = "error";
	$status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}

// Отображение результата:
echo json_encode(["result" => $result, /*"resultfile" => $rfile,*/ "status" => $status]);
