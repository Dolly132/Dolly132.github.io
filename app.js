let data = [];

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

function render() {
    const table = document.getElementById("table");
    table.innerHTML = "";
    data.forEach((row, r) => {
        const tr = document.createElement("tr");
        row.forEach((cell, c) => {
            const td = document.createElement("td");
            td.contentEditable = true;
            td.innerText = cell || "";
            td.oninput = () => data[r][c] = td.innerText;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}

function save() {
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "updated.xlsx");
}
