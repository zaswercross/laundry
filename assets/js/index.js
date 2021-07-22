let getActual = () => {
    let registros = '<table><thead><th class="text-center">Folio</th><th class="text-center">Fecha</th><th class="text-center">Nombre</th><th class="text-center"># Productos</th><th class="text-center">Descripción</th><th>Precio</th><th class="text-center">Estatus</th></thead><tbody>';
 fetch("core/registers.php?actual", {
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
                    registros += `<td class="text-center">${e.estatus == 1 ? '<i class="fa fa-check text-success fw-bolder" aria-hidden="true"></i>' : '<button data-id="'+e.idregistros+'" class="btn btn-sm btn-danger fa fa-times fw-bolder text-white btnActivar"></button>' }</td>`;
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
  fetch("core/registers.php?widgets", {
    method: 'GET'
})
  .then( resp => resp.json())
  .then( data => {
      if (data != "") { 
          document.querySelector('.entregadosWid').innerHTML = data[0].Entregado;
          document.querySelector('.pendientesWid').innerHTML = data[0].Falta;
          document.querySelector('.faltantesWid').innerHTML = data[0].Pendiente;
        }
  })
  .catch(error => console.log('error', error));
}
getActual();

let modalSearch = new bootstrap.Modal(document.getElementById('modalSearch'))
// let modalAdd = document.getElementById('modalAdd');
let modalAdd = new bootstrap.Modal(document.getElementById('modalAdd'))



document.getElementById('formSearch').addEventListener('submit', e => {
	e.preventDefault();
	let formData = new FormData(e.target);

	fetch('core/registers.php',{
		method:"GET"
	})

});
document.getElementById('formAdd').addEventListener('submit', e => {
	e.preventDefault();
	let formData = new FormData(e.target);

	fetch('core/registers.php',{
		method:"POST",
		body:formData
	})
		.then( resp => resp.json())
		.then( data => {
			if(data != ""){
				modalAdd.toggle()
				swal("¡Excelente!", "Se agregó un nuevo registro", "success");
				getActual();
			}
		})
		.catch( error => {
			swal("¡Ouups!", "Ocurrió un error en el proceso", "warning");
		})

});

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
						getActual();
						swal("¡Excelente!", "El producto se entregó ", "success");
					}
				})
				.catch( error => {
					swal("¡Ouups!", "Ocurrió un error en el proceso", "warning");
				})
			} else {
			  swal("¡No se cambió el estatus!");
			}
		  });
	}
});