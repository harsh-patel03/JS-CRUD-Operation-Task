document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('commentForm');
    const tableContainer = document.getElementById('table-container');
    const updateButton = document.getElementById('updateButton'); // Changed from 'submit' to 'updateButton'
    let data = [];
    let currentIndex = -1;

    // Fetch initial data from the API
    fetch('https://jsonplaceholder.typicode.com/comments?postId=1')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(initialData => {
            data = initialData.map(user => ({
                postid: user.postId,
                id: user.id,
                name: user.name,
                email: user.email,
                body: user.body
            }));
            createTable();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            tableContainer.textContent = 'Failed to load data.';
        });

    // Handle form submission
    form.addEventListener('submit', event => {
        event.preventDefault();

        const postid = document.getElementById('postid').value;
        const id = document.getElementById('id').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const body = document.getElementById('body').value;

        if (currentIndex === -1) {
            data.push({ postid, id, name, email, body });
        } else {
            data[currentIndex] = { postid, id, name, email, body };
            currentIndex = -1;
            updateButton.style.display = 'none';
        }

        form.reset();
        createTable();
    });

    // Function to create and update the table
    function createTable() {
        tableContainer.innerHTML = '';

        if (data.length === 0) return;

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headers = ['postid', 'id', 'name', 'email', 'body'];
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });

        const actionTh = document.createElement('th');
        actionTh.textContent = 'Actions';
        headerRow.appendChild(actionTh);
        thead.appendChild(headerRow);

        data.forEach((item, index) => {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = item[header];
                row.appendChild(td);
            });

            const actionTd = document.createElement('td');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                document.getElementById('postid').value = item.postid;
                document.getElementById('id').value = item.id;
                document.getElementById('name').value = item.name;
                document.getElementById('email').value = item.email;
                document.getElementById('body').value = item.body;
                currentIndex = index;
                updateButton.style.display = 'inline';
            });

            actionTd.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                data.splice(index, 1);
                createTable();
            });

            actionTd.appendChild(deleteButton);
            row.appendChild(actionTd);
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        tableContainer.appendChild(table);
    }
});