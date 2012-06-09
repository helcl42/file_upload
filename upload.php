<?php

/*
 * Set folder where to upload files, then it's necessary to
 * change permissions to that folder
 */

$path = "Uploads/";
$fileName = (isset($_SERVER['HTTP_X_FILENAME']) ? $_SERVER['HTTP_X_FILENAME'] : false);

if ($fileName) { //AJAX
    file_put_contents(($path == "" ? 'Uploads/' : $path). $fileName, file_get_contents('php://input'));
    echo "$fileName uploaded"; //ajax response
    exit();
} else {         //SUBMIT
    $files = $_FILES['fileselect'];

    foreach ($files['error'] as $id => $err) {
        if ($err == UPLOAD_ERR_OK) {
            $fileName = $files['name'][$id];
            move_uploaded_file($files['tmp_name'][$id], ($path == "" ? 'Uploads/' : $path) . $fileName);
            echo "<p>File $fileName uploaded.</p>";
        }
    }
}

?>