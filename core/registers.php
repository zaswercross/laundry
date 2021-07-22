<?php
include "config.php";
include "utils.php";
$dbConn      = connect($db);
$fechaActual = date('Y-m');
$anioActual  = date('Y');
$widgetSel   = "SELECT (SELECT count(1) FROM registros WHERE estatus = 1 AND fecha >= '".$fechaActual."-01') AS Entregado, (SELECT count(1) FROM registros WHERE estatus = 0 AND fecha >= '".$fechaActual."-01') AS Falta,(SELECT count(1) FROM registros WHERE estatus = 0 AND fecha >= '".$anioActual."-01-01') AS Pendiente;";
// echo $widgetSel; die();
/*
  listar todos los registros o solo uno
 */
if ($_SERVER['REQUEST_METHOD'] == 'GET'){
	if (isset($_GET['folio'])){
		//Mostrar un registro
		$sql = $dbConn->prepare("SELECT * FROM registros where folio=:folio");
		$sql->bindValue(':folio', $_GET['folio']);
		$sql->execute();
		header("HTTP/1.1 200 OK");
		echo json_encode(  $sql->fetch(PDO::FETCH_ASSOC), true  );
		exit();
	} else if (isset($_GET['nombrecl'])){
		//Mostrar un registro
		$sql = $dbConn->prepare("SELECT * FROM registros where nombrecl=:nombrecl");
		$sql->bindValue(':nombrecl', $_GET['nombrecl']);
		$sql->execute();
		header("HTTP/1.1 200 OK");
		echo json_encode(  $sql->fetch(PDO::FETCH_ASSOC),true  );
		exit();
	} else if (isset($_GET['widgets'])){
		//Mostrar los registros del mes actual
		$sql = $dbConn->prepare($widgetSel);
		$sql->bindValue(':widgets', $_GET['widgets']);
		$sql->execute();
		$sql->setFetchMode(PDO::FETCH_ASSOC);
		header("HTTP/1.1 200 OK");
		echo json_encode(  $sql->fetchAll()  );
		exit();
	} else if (isset($_GET['actual'])){
		//Mostrar los registros del mes actual
		$sql = $dbConn->prepare("SELECT idregistros, fecha, folio, nombrecl, descripcion, numproductos, precio, estatus FROM registros WHERE fecha LIKE '".$fechaActual."%' AND estatus = 0");
		$sql->bindValue(':actual', $_GET['actual']);
		$sql->execute();
		$sql->setFetchMode(PDO::FETCH_ASSOC);
		header("HTTP/1.1 200 OK");
		echo json_encode(  $sql->fetchAll()  );
		exit();
	}else if (isset($_GET['history'])){
		//Mostrar lista de post
		$sql = $dbConn->prepare("SELECT * FROM registros WHERE fecha >= '".$anioActual."-01-01'");
		$sql->execute();
		$sql->setFetchMode(PDO::FETCH_ASSOC);
		header("HTTP/1.1 200 OK");
		echo json_encode( $sql->fetchAll(), true  );
		exit();
	}
}
// Crear un nuevo registro
if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    $input = $_POST;
    $sql = "INSERT INTO registros
		(folio, nombrecl, descripcion, fecha, numproductos,precio, estatus ) 
		VALUES (:folioAdd, :nameClientAdd, :descriptionAdd, CURDATE(), :numProducts ,:precioAdd ,0)";
    $statement 	= $dbConn->prepare($sql);
    bindAllValues($statement, $input);
    $statement->execute();
    $postId 	= $dbConn->lastInsertId();
    if($postId){
		// echo json_encode($postId);
      $input['folio'] = $postId;
      header("HTTP/1.1 200 OK");
      echo json_encode($input,true);
      exit();
	 }
}
//Borrar
if ($_SERVER['REQUEST_METHOD'] == 'DELETE'){
	// $id = $_GET['id'];
	// $statement = $dbConn->prepare("DELETE FROM registros where id=:id");
	// $statement->bindValue(':id', $id);
	// $statement->execute();
	header("HTTP/1.1 200 OK");
	exit();
}
//Actualizar
if ($_SERVER['REQUEST_METHOD'] == 'PUT'){
    $input = $_GET;
	// var_dump($_GET);die();
    $postId = $input['idReg'];
    $fields = getParams($input);
    $sql = "UPDATE registros
          SET estatus = 1, entregado = CURDATE()
          WHERE idregistros='$postId'";
    $statement = $dbConn->prepare($sql);
    bindAllValues($statement, $input);
    $statement->execute();
    header("HTTP/1.1 200 OK");
	echo '{"Code":1}';
    exit();
}
//En caso de que ninguna de las opciones anteriores se haya ejecutado
header("HTTP/1.1 400 Bad Request");