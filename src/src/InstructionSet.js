
const Instruction_NoOp = 0;
const Instruction_Exec = 1;
const Instruction_JumpToTag = 2;
const Instruction_ConditionalJumpToTag = 3;
const Instruction_Break = 4;

var InstructionNames = [];
InstructionNames[Instruction_NoOp] = "NoOp";
InstructionNames[Instruction_Exec] = "Exec";
InstructionNames[Instruction_JumpToTag] = "JumpToTag";
InstructionNames[Instruction_ConditionalJumpToTag] = "ConditionalJumpToTag";
InstructionNames[Instruction_Break] = "Break";
