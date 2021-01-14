<?php
	$siteurl = 'https://www.words-mincer.top';
	$url = parse_url($_SERVER['REQUEST_URI']);
	mb_parse_str($url['query'], $query_parts);
	$share = $query_parts['share'];
	$page = $query_parts['page'];
	$level = $query_parts['level'];
	$sublevel = $query_parts['sublevel'];
  $user = $query_parts['user'] != 'undefined' ? $query_parts['user'] : '';
  $user_name = $query_parts['userName'] != 'undefined' ? $query_parts['userName'] : '';
  $user_img = $query_parts['userImg'] != 'undefined' ? $query_parts['userImg'] : '';
	$lang = $query_parts['lang'];
	$referer = $query_parts['referer'];
	$share_url = $user ? $siteurl.'/'.$page.'/'.$user.'/'.$lang : $siteurl.'/'.$page;
  $link = $siteurl.$_SERVER['REQUEST_URI'];
  $img = $user_img ? $user_img : $siteurl.'/static/img/icons/icon-512x512.png';
  if($lang == 'ru'){
    switch ($page) {
      case 'home': {
        $title = 'Мясорубка Слов';
        $desc = 'Игра Мясорубка Слов - составление слов из перемешанных букв. Решайте задачи, зарабатывайте монеты, используйте бонусы и подсказки! Осторожно - сложность игры возрастает с каждым новым уровнем!';
        break;
      }
      case 'game': {
        $title = 'Уровень '.$level.'/'.$sublevel.' в Мясорубке Слов';
        $desc = 'Я только что прошел уровень '.$level.'/'.$sublevel.' в игре Мясорубка Слов! Поздравь меня и попробуй повторить это нелегкое задание!';
        break;
      }
      case 'top': {
        $title = 'Мясорубка Слов - ТОП 20 игроков';
        $desc = 'Игра Мясорубка Слов - составление слов из перемешанных букв. А ты можешь попасть в этот список?';
        break;
      }
      case 'instruction': {
        $title = 'Мясорубка Слов - инструкция';
        $desc = 'Игра Мясорубка слов - ознакомься с правилами игры, чтобы быть более эффективным в ней!';
        break;
      }
      case 'user': {
        $title = $user_name.' в Мясорубке Слов';
        $desc = $user_name.' в игре Мясорубка слов - профиль и достижения пользователя. Кто сможет повторить?';
        break;
      }
    }
  }
  if($lang == 'uk'){
    switch ($page) {
      case 'home': {
        $title = 'М\'ясорубка Слів';
        $desc = 'Гра М\'ясорубка Слів - складання слів з перемішаних букв. Вирішуйте завдання, заробляйте монети, використовуйте бонуси і підказки! Обережно - складність гри зростає з кожним новим рівнем!';
        break;
      }
      case 'game': {
        $title = 'Рівень '.$level.'/'.$sublevel.' у М\'ясорубці Слів';
        $desc = 'Я тільки що пройшов рівень '.$level.'/'.$sublevel.' у грі Мясорубка Слів! Привітай мене і спробуй повторити це нелегке завдання!';
        break;
      }
      case 'top': {
        $title = 'М\'ясорубка Слів - ТОП 20 гравців';
        $desc = 'Гра М\'ясорубка Слів - складання слів з перемішаних букв. А ти можеш потрапити в цей список?';
        break;
      }
      case 'instruction': {
        $title = 'М\'ясорубка Слів - інструкція';
        $desc = 'Гра М\'ясорубка Слів - ознайомся з правилами гри, щоб бути більш ефективним в ній!';
        break;
      }
      case 'user': {
        $title = $user_name.' в М\'ясорубці Слів';
        $desc = $user_name.' в грі М\'ясорубка Слів - профіль і досягнення користувача. Хто зможе повторити?';
        break;
      }
    }
  }
  $ref = $_SERVER['HTTP_REFERER'];
	if (strpos($ref, 'facebook.com') !== false) {
		header('Location: '.$share_url);
		exit();
	}
	if (strpos($ref, 't.co') !== false) {
		header('Location: '.$share_url);
		exit();
	}
	if (strpos($ref, 'away.vk.com') !== false) {
		header('Location: '.$share_url);
		exit();
	}
	if ($referer) {
		header('Location: '.$share_url);
		exit();
  }
?>
<html>
<head>
  <title><?php echo $title; ?></title>
  <meta property="og:url" content="<?php echo $link; ?>"/>
  <meta property="og:type" content="website"/>
  <meta property="og:title" content="<?php echo $title; ?>"/>
  <meta property="og:description" content="<?php echo $desc; ?>"/>
  <meta property="og:image" content="<?php echo $img; ?>"/>
  <script>
    window.onpopstate = function (event) {
      location.href = '<?php echo $ref; ?>';
    }
  </script>
</head>
<body>
<a href="https://www.facebook.com/sharer.php?u=<?php echo urlencode( $link ); ?>" id="facebook"></a>
<a href="https://telegram.me/share/url?url=<?php echo urlencode( $link.'&referer=telegram' ); ?>&text=<?php echo urlencode($desc); ?>" id="telegram"></a>
<a href="https://twitter.com/share?url=<?php echo urlencode( $link ); ?>&text=<?php echo urlencode($desc); ?>" id="twitter"></a>
<a href="https://vk.com/share.php?url=<?php echo urlencode( $link ); ?>&title=<?php echo urlencode($title); ?>" id="vk"></a>
<a href="https://api.whatsapp.com/send?text=<?php echo urlencode( $link.'&referer=whatsapp' ); ?> - <?php echo $desc; ?>" id="whatsapp"></a>
<a href="https://connect.ok.ru/offer?url=<?php echo urlencode($link); ?>&title=<?php echo urlencode($title); ?>" id="odnoklassniki"></a>
<script>
	<?php 
	switch ($share) {
		case 'facebook': {
			echo 'document.getElementById(\'facebook\').click();';
			break;
		}
		case 'telegram': {
			echo 'document.getElementById(\'telegram\').click();';
			break;
		}
		case 'twitter': {
			echo 'document.getElementById(\'twitter\').click();';
			break;
		}
		case 'vk': {
			echo 'document.getElementById(\'vk\').click();';
			break;
		}
		case 'whatsapp': {
			echo 'document.getElementById(\'whatsapp\').click();';
			break;
		}
		case 'odnoklassniki': {
			echo 'document.getElementById(\'odnoklassniki\').click();';
			break;
		}
	}
	?>
</script>
</body>
</html>