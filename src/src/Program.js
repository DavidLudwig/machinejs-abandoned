
function Program() {
    // program stuff
    this.instructions = [];
    this.tags = [];
}

// Program Management

Program.prototype.addInstruction = function (instruction, arg1) {
    this.instructions.push([instruction, arg1]);
}

Program.prototype.countInstructions = function () {
	return this.instructions.length;
}

Program.prototype.getInstruction = function (index) {
	return this.instructions[index];
}

Program.prototype.getTag = function (tagID) {
    return this.tags[tagID];
}

Program.prototype.setTag = function (tagID) {
    this.tags[tagID] = this.instructions.length;
}
