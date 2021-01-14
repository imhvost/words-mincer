<?php

$_POST = array_map('strip_tags', $_POST);

$action = $_POST['action'];

if ($action == 'addWord') {
  $word = $_POST['word'];
  $desc = $_POST['desc'];
  $user_id = $_POST['userId'];

  $json = file_get_contents("../../data/words_ru_new.json");
  $json = json_decode($json, true);

  if (!is_null($json)) {
    if (!array_key_exists($user_id, $json)) {
      $json[$user_id] = array();
    }
    $json[$user_id][$word] = $desc;
    $json = json_encode($json, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  }

  if ($json) {
    $put = file_put_contents("../../data/words_ru_new.json", $json);
    
  }
}

if ($action == 'saveFile') {
  $json = $_POST['json'];
  $file_name = $_POST['fileName'];
  if ($json) {
    file_put_contents("../../data/".$file_name, $json);
  }
}

?>