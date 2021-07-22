let getHistory = () => {
    let registros = '<table><thead><th class="text-center">Folio</th><th>Fecha</th><th class="text-center">Nombre</th><th class="text-center"># Productos</th><th class="text-center">Descripción</th><th>Precio</th><th class="text-center">Fecha Entrega</th><th class="text-center">Estatus</th></thead><tbody>';
 fetch("core/registers.php?history", {
    method: 'GET'
})
  .then( resp => resp.json())
  .then( data => {
    if (data != "") {
        data.forEach(e => {
            // console.log(tr)
            registros += `<tr>`;
                    registros += `<td class="text-center">${e.folio}</td>`;
                    registros += `<td class="text-center">${e.fecha}</td>`;
                    registros += `<td class="text-center">${e.nombrecl}</td>`;
                    registros += `<td class="text-center">${e.numproductos}</td>`;
                    registros += `<td class="text-center">${e.descripcion}</td>`;
                    registros += `<td class="text-center">${e.precio != null ? "$"+e.precio : "-"}</td>`;
                    registros += `<td class="text-center">${e.entregado != null ? '<span class="fw-bolder">'+e.entregado+'</span>' : '-' }</td>`;
                    registros += `<td class="text-center">${e.estatus == 1 ? '<span class="text-success fw-bolder">ENTREGADO</span>' : '<button data-id="'+e.idregistros+'" class="btn btn-sm btn-danger fa fa-times fw-bolder text-white btnActivar"></button>' }</td>`;
            registros += `</tr>`;
        })
        registros += `</tbody></table>`;
        document.querySelector('.tableContent').innerHTML = registros;
        let dataTable = new DataTable(".tableContent table");
    } else {
		let registros = '<table><thead><th class="text-center">Folio</th><th class="text-center">Nombre</th><th class="text-center">Descripción</th><th class="text-center">Estatus</th></thead><tbody>';
        registros += `<tr><td></td><td class="fw-bolder text-center">SIN</td><td class="fw-bolder text-center"> REGISTROS</td></tr></tbody></table>`;
        document.querySelector('.tableContent').innerHTML = registros;
        let dataTable = new DataTable(".tableContent table");
    }
  })
  .catch(error => console.log('error', error));

}
getHistory();

document.querySelector('.tableContent').addEventListener('click', element => {
	if (element.target.classList.contains('btnActivar')) {
		let idReg = element.target.getAttribute('data-id');
		swal({
			title: "¿Estás seguro de cambiar el estatus?",
			text: "Una vez cambiado, ya no se puede regresar al estatus anterior",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		})
		.then((willDelete) => {
			if (willDelete) {
				fetch("core/registers.php?idReg="+idReg, {
					method: 'PUT'
				})
				.then( resp => resp.json())
				.then( data => {
					if (data.Code == 1) {
						getHistory();
						swal("¡Excelente!", "El producto se entregó ", "success");
					}
				})
        .catch( error => {
          swal("¡Ouups!", "Ocurrió un error en el proceso", "warning");
        });
			} else {
			  swal("¡No se cambió el estatus!");
			}
		  });
	}
});