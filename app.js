document.getElementById("uploadBtn").onclick = () => {
    document.getElementById("file").click();
}

let data = [];
let table_thead = document.getElementById("table-thead");
let table_tbody = document.getElementById("table-tbody");
let search_select = document.getElementById("select");
const searchInput = document.getElementById("search");
let panel = document.getElementById("panel");

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

function deleteTableData(resetSelect = false) {
    while (table_thead.firstChild) {
        table_thead.removeChild(table_thead.firstChild);
    }

    while (table_tbody.firstChild) {
        table_tbody.removeChild(table_tbody.firstChild);
    }

    if (resetSelect == true) {
        while (search_select.firstChild) {
            search_select.removeChild(search_select.firstChild);
        }
    }
}

function renderTable(tableData, resetSelect = false) {
    deleteTableData(resetSelect);

    const columns = tableData[0];

    var tr = document.createElement("tr");
    tr.innerHTML = "";

    if (resetSelect == true) {
        for (var i = 0; i < columns.length; i++) {
            tr.innerHTML += "<th>"+columns[i]+"</th>";

            var option = document.createElement("option");
            option.innerHTML = columns[i];
            option.setAttribute("value", i);
            search_select.append(option);
        }
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

    renderTable(data, true);

    const columns = data[0];
    let columnsInputs = [];

    for (var i = 0; i < columns.length; i++) {
        var section = document.createElement("div");
        section.className = "form-section";

        var label = document.createElement("label");
        label.innerHTML = columns[i];
        label.style.fontWeight = "bold";
        label.style.fontSize = "15px";
        label.style.display = "inline-block";

        section.appendChild(label);
        var input = document.createElement("input");
        input.style.width = "50%";
        input.type = "text";
        label.style.marginTop = "10px";
        input.setAttribute("id", "panel-column"+i);

        section.appendChild(input);

        panel.appendChild(section);

        columnsInputs.push(input);
    }

    var btn = document.createElement("button");
    btn.className = "button";
    btn.innerHTML = "Add";
    panel.appendChild(btn);

    btn.onclick = () => {
        for (var i = 0; i < columnsInputs.length; i++) {
            let newRow = new Array(columnsInputs.length);
            newRow.push(columnsInputs[i].value);
        }

        addNewRow(rowData);
        alert("CLicked!!");
    };
}

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase()
    const val = search_select.value;
    if (val == -1) {
        return;
    }

    const filtered = data.filter((row, index) => {
        if (index === 0) {
            return true; // keep header
        }

        const cell = row[val] ? row[val].toString().toLowerCase() : "";
        return cell.includes(query);
    });

    renderTable(filtered);
});

const btn = document.getElementById("toggleBtn");

btn.addEventListener("click", () => {
    if (panel.clientHeight === 0) {
        // Slide Down
        panel.style.height = panel.scrollHeight + "px";
    } else {
        // Slide Up
        panel.style.height = 0;
    }
});

function addNewRow(rowData) {
    data.push(rowData);
}

document.getElementById("download").onclick = ()=>{
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "updated.xlsx");
}