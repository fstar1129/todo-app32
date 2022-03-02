const todo = artifacts.require("todo");


contract("Todo", async accounts => {
    let todoContract;
    beforeEach(async () => {
        todoContract = await todo.new();
    })
    it("Create new Todo", async () => {
        const _date = parseInt((new Date()).getTime() / 1000) + 60 * 60;
        const _title = "Task1";
        const _description = "Description 1";
        const _status = 1;
        const _priority = 2;
        const tx = await todoContract.addTodo(
            _date,
            _title,
            _description,
            _status,
            _priority
        );
        const args = tx.receipt.logs[0].args;
        const walletAddress = args.walletAddress;
        const id = args.id;
        assert.equal(walletAddress.toLowerCase(), accounts[0].toLowerCase(), "Wallet not matched");
        assert.equal(id.toString(), "0");
        const todos = await todoContract.todosByWallet(walletAddress, id);
        assert.equal(todos[0].toString(), _date.toString());
        assert.equal(todos[1].toString(), _title.toString());
        assert.equal(todos[2].toString(), _description.toString());
        assert.equal(todos[3].toString(), _status.toString());
        assert.equal(todos[4].toString(), _priority.toString());
        // assert.equal(todos[5].toString(), accounts[0].toString());


    })
    it("Update Todo", async () => {
        const _date = parseInt((new Date()).getTime() / 1000) + 60 * 60;
        const _title = "Task1";
        const _description = "Description 1";
        const _status = 1;
        const _priority = 2;
        const tx = await todoContract.addTodo(
            _date,
            _title,
            _description,
            _status,
            _priority
        );
        const args = tx.receipt.logs[0].args;
        const walletAddress = args.walletAddress;
        const id = args.id;
        assert.equal(walletAddress.toLowerCase(), accounts[0].toLowerCase(), "Wallet not matched");
        assert.equal(id.toString(), "0");
        //title is updating 
        const _Updatedtitle = "title updated"
        await todoContract.updateTodo(
            id,
            _date,
            _Updatedtitle,
            _description,
            _status,
            _priority
        );
        const todos = await todoContract.todosByWallet(walletAddress, id);
        assert.equal(todos[0].toString(), _date.toString());
        assert.equal(todos[1].toString(), _Updatedtitle.toString());
        assert.equal(todos[2].toString(), _description.toString());
        assert.equal(todos[3].toString(), _status.toString());
        assert.equal(todos[4].toString(), _priority.toString());
        // assert.equal(todos[5].toString(), accounts[0].toString());


    })
    it("Deleting Todo", async () => {
        const _date = parseInt((new Date()).getTime() / 1000) + 60 * 60;
        const _title = "Task1";
        const _description = "Description 1";
        const _status = 1;
        const _priority = 2;
        const tx = await todoContract.addTodo(
            _date,
            _title,
            _description,
            _status,
            _priority
        );
        const args = tx.receipt.logs[0].args;
        const walletAddress = args.walletAddress;
        const id = args.id;
        assert.equal(walletAddress.toLowerCase(), accounts[0].toLowerCase(), "Wallet not matched");
        assert.equal(id.toString(), "0");
       
        await todoContract.removeTodo(0);
        const length = await todoContract.numberOfTodo(walletAddress);
        assert.equal(length, 0);


    })
})