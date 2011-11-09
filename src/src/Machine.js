
const Instruction_NoOp = 0;
const Instruction_Exec = 1;
const Instruction_JumpToTag = 2;

var InstructionNames = [];
InstructionNames[Instruction_NoOp] = "NoOp";
InstructionNames[Instruction_Exec] = "Exec";
InstructionNames[Instruction_JumpToTag] = "JumpToTag";

function Machine() {
    // program stuff
    this.program = [];
    this.tags = [];
    
    // machine stuff
    this.instructionPointer = 0;
    this.debugTrace = false;
}

// Program Management

Machine.prototype.addInstruction = function (instruction, arg1) {
    this.program.push([instruction, arg1]);
}

Machine.prototype.setTag = function (tagID) {
    this.tags[tagID] = this.program.length;
}

Machine.prototype.getTag = function (tagID) {
    return this.tags[tagID];
}

// Running code

Machine.prototype.getInstructionPointer = function () {
    return this.instructionPointer;
}

Machine.prototype.cycle = function () {
    var currentInstruction = this.program[this.instructionPointer];
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
            iArg1();
            this.instructionPointer++;
            break;
        
        case Instruction_JumpToTag:
            this.instructionPointer = this.getTag(iArg1);
            if (this.debugTrace == true) {
                console.log("... cycle-extra: ip=" + this.instructionPointer);
            }
            break;
    }
}

Machine.prototype.run = function () {
    while (this.instructionPointer < this.program.length) {
        this.cycle();
    }
}

/*
Player.prototype.play = function(song) {
  this.currentlyPlayingSong = song;
  this.isPlaying = true;
};

Player.prototype.pause = function() {
  this.isPlaying = false;
};

Player.prototype.resume = function() {
  if (this.isPlaying) {
    throw new Error("song is already playing");
  }

  this.isPlaying = true;
};

Player.prototype.makeFavorite = function() {
  this.currentlyPlayingSong.persistFavoriteStatus(true);
};
*/
