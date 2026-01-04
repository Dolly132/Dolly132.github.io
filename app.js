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
    while (table_tbody.firstChild) {
        table_tbody.removeChild(table_tbody.firstChild);
    }

    if (resetSelect == true) {
        while (table_thead.firstChild) {
            table_thead.removeChild(table_thead.firstChild);
        }

        while (search_select.firstChild) {
            search_select.removeChild(search_select.firstChild);
        }
    }
}

function renderTable(tableData, resetSelect = false) {
    deleteTableData(resetSelect);

    const columns = tableData[0];

    if (resetSelect) {
        const tr = document.createElement("tr");

        columns.forEach((col, i) => {
            const th = document.createElement("th");
            th.textContent = col;
            tr.appendChild(th);

            const option = document.createElement("option");
            option.value = i;
            option.textContent = col;
            search_select.appendChild(option);
        });

        table_thead.appendChild(tr);
    }

    for (let i = 1; i < tableData.length; i++) {
        const tr = document.createElement("tr");

        for (let j = 0; j < tableData[i].length; j++) {
            const td = document.createElement("td");
            td.textContent = tableData[i][j] !== undefined ? tableData[i][j] : "";
            tr.appendChild(td);
        }

        table_tbody.appendChild(tr);
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
        label.style.display = "block";

        section.appendChild(label);
        var input = document.createElement("input");
        input.style.width = "50%";
        input.type = "text";
        label.style.marginTop = "20px";
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
        const headers = data[0]; // first row = column names
        const newRow = new Array(headers.length).fill(""); // empty row same length as header

        // Fill newRow with input values
        columnsInputs.forEach((input, i) => {
            newRow[i] = input.value;
        });

        // Add to table data
        data.push(newRow);

        // Render table (do NOT reset header)
        renderTable(data, false);

        // Optionally clear inputs
        columnsInputs.forEach(input => input.value = "");
    };
}

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const val = search_select.value;
    if (val == -1) {
        return;
    }

    const filtered = data.filter((row, index) => {
        if (index == 0 || index == 1) {
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

document.getElementById("download").onclick = ()=>{
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "updated.xlsx");
}