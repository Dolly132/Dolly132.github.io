document.getElementById("uploadBtn").onclick = () => {
    document.getElementById("file").click();
}

let data = [];
let table_thead = document.getElementById("table-thead");
let table_tbody = document.getElementById("table-tbody");

const searchInput = document.getElementById("search");

document.getElementById("file").onchange = e => {
    const reader = new FileReader();
    reader.onload = evt => {
        const wb = XLSX.read(evt.target.result, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        render();
    };
    reader.readAsArrayBuffer(e.target.files[0]);
};

function deleteTableData() {
    while (table_thead.firstChild) {
        table_thead.removeChild(table_thead.firstChild);
    }

    while (table_tbody.firstChild) {
        table_tbody.removeChild(table_tbody.firstChild);
    }
}

function renderTable(tableData) {
    deleteTableData();

    const columns = tableData[0];

    var tr = document.createElement("tr");
    tr.innerHTML = "";

    for (var i = 0; i < columns.length; i++) {
        tr.innerHTML += "<th>"+columns[i]+"</th>";
    }

    table_thead.append(tr);

    for (var i = 1; i < tableData.length; i++) {
        var tdTr = document.createElement("tr");
        tdTr.innerHTML = "";

        for (var j = 0; j < tableData[i].length; j++) {
            tdTr.innerHTML += "<td>"+tableData[i][j]+"</td>"
        }

        table_tbody.append(tdTr);
    }
}

function render() {
    if (data.length == 0) {
        return;
    }

    renderTable(tableData);
}