<?php

$_POST = array_map('strip_tags', $_POST);

$action = $_POST['action'];

if ($action == 'addWord') {
  $word = $_POST['word'];
  $desc = $_POST['desc'];
  $lang = $_POST['lang'];
  $user_id = $_POST['userId'];

  $json = file_get_contents("../../data/words_new.json");
  $json = json_decode($json, true);
  // var_dump($json);

  if (is_null($json)) $json = array();

  if (!array_key_exists($user_id, $json)) {
    $json[$user_id] = array('ru' => array(), 'uk' => array());
  }
  $json[$user_id][$lang][$word] = $desc;
  $json = json_encode($json, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

  if ($json) {
    $put = file_put_contents("../../data/words_new.json", $json);
    var_dump($action);
  }
}

if ($action == 'saveFile') {
  $json = $_POST['json'];
  $file_name = $_POST['fileName'];
  if ($json) {
    file_put_contents("../../data/".$file_name, $json);
  }
}

if ($action == 'deleteWords') {
  $words = explode(',', $_POST['words']);
  $lang = $_POST['lang'];
  $user_id = $_POST['userId'];

  $json = file_get_contents("../../data/words_new.json");
  $json = json_decode($json, true);

  if (is_null($json)) return;

  if (array_key_exists($user_id, $json)) {
    if (array_key_exists($lang, $json[$user_id])) {
      foreach($words as $word) {
        if (array_key_exists($word, $json[$user_id][$lang])) {
          unset($json[$user_id][$lang][$word]);
        }
      }
    }
  }
  $json = json_encode($json, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

  if ($json) {
    $put = file_put_contents("../../data/words_new.json", $json);
    var_dump($action);
  }
}

if ($action == 'addWordsMaster') {
  $words = explode(',', $_POST['words']);
  $lang = $_POST['lang'];
  $desc = explode('~~', $_POST['desc']);

  var_dump($words);
  var_dump($desc);

  $json = file_get_contents("../../data/words_".$lang.".json");

  $config = file_get_contents("../../data/config.json");
  $config = json_decode($config, true);

  if (!is_null($config)) {
    $version = $config['wordsVersion'][$lang];
    file_put_contents("../../data/words_".$lang."_(".$version.")_(".date('o-m-d').").json", $json);
  }

  $json = json_decode($json, true);

  if (is_null($json) || is_null($config)) return;

  foreach($words as $key => $word) {
    $json[mb_strlen($word)][$word] = $desc[$key];
  }

  $json = json_encode($json, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

  if ($json) {
    $put = file_put_contents("../../data/words_".$lang.".json", $json);
    var_dump($action);
    if ($put) {
      $config['wordsVersion'][$lang] = $version + 1;
      $config = json_encode($config, JSON_PRETTY_PRINT);
      if ($config) {
        $put = file_put_contents("../../data/config.json", $config);
      }
    }
  }
}

?>