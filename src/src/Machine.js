
//var codeA = new Function("console.log('foo: ' + this.foo);  this.foo = 'BAR';");
// var codeB = new Function("console.log('foo: ' + this['foo']);");
// var myObject = new Array();
// myObject["foo"] = "FOO!";
//codeA.call(myObject);
// codeB.call(myObject);

var codeC = new Function("console.log('hi'); return 1 + 3;");
console.log(codeC.call());

function Machine() {
    // program stuff
    //this.program = [];
    this.tags = [];
	this.program = null;
	this.execEnvironment = null;
    
    // machine stuff
    this.instructionPointer = 0;
    this.conditionalFlag = false;
	this.breakFlag = false;
    this.debugTrace = false;
}

// Program Management

Machine.prototype.loadProgram = function (aProgram) {
	this.program = aProgram;
}

Machine.prototype.getProgram = function () {
	return this.program;
}

// Environment management

Machine.prototype.setExecEnvironment = function (env) {
	this.execEnvironment = env;
}

// Running code

Machine.prototype.getInstructionPointer = function () {
    return this.instructionPointer;
}

Machine.prototype.cycle = function () {
    //var currentInstruction = this.program[this.instructionPointer];
	var currentInstruction = this.getProgram().getInstruction(this.instructionPointer);
    var iType = currentInstruction[0];
    var iArg1 = currentInstruction[1];        
    
    if (this.debugTrace == true) {
        var instructionName = "no-instruction";
        if (InstructionNames[iType]) {
            instructionName = "<" + InstructionNames[iType] + ">";
        }
        console.log("CYCLE: ip=" + this.instructionPointer + "; " + instructionName);    
    }
    
    switch (iType) {
        case Instruction_NoOp:
            this.instructionPointer++;
            break;
        
        case Instruction_Exec:
            this.conditionalFlag = (iArg1.call(this.execEnvironment) == true);
            this.instructionPointer++;
            break;
        
        case Instruction_JumpToTag:
            this.instructionPointer = this.program.getTag(iArg1);
            if (this.debugTrace == true) {
                console.log("... cycle-extra: ip=" + this.instructionPointer);
            }
            break;
        
        case Instruction_ConditionalJumpToTag:
            if (this.conditionalFlag == true) {
                this.instructionPointer = this.program.getTag(iArg1);
                if (this.debugTrace == true) {
                    console.log("... cycle-extra: ip=" + this.instructionPointer);
                }
            } else {
                this.instructionPointer++;
            }
            break;

		default:	// Prevent lockups from invalid instructions by simply breaking.
		case Instruction_Break:
			this.breakFlag = true;
			this.instructionPointer++;
			break;
    }
}

Machine.prototype.run = function () {
	this.breakFlag = false;
	
	if (this.program == null) {
		return;
	}
	
    while (this.instructionPointer < this.program.countInstructions() && this.breakFlag == false) {
        this.cycle();
    }
}
