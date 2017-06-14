function showAlert(err, msg) {
	if (err.type != "REQUEST_REJECTED") {
		swal({
		  title: "Error",
		  text: msg,
		  type: "error"
		});
	}
}