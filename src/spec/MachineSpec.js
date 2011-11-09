describe("Machine", function () {
    var theMachine = null;
    
    beforeEach(function () {
        theMachine = new Machine();
    });
    
    it("has an instruction pointer, which starts at zero", function () {
        expect(theMachine.getInstructionPointer()).toEqual(0);
    });
    
    it("can have instructions added to a built-in program", function () {
        theMachine.addInstruction(Instruction_Exec, function () {});
        theMachine.addInstruction(Instruction_NoOp);
    });
        
    it("can run instruction-less programs", function () {
        theMachine.run();
    });
    
    it("can run programs with arbitrary code via the Exec instruction", function () {
        var didInstructionRun = false;

        theMachine.addInstruction(Instruction_Exec, function () { didInstructionRun = true; });
        theMachine.run();

        expect(didInstructionRun).toBeTruthy();
        expect(theMachine.getInstructionPointer()).toEqual(1);
    });
    
    it("can run multiple instructions, in order", function () {
        var counter = 0;
        var counterAtInstructionOne = null;
        var counterAtInstructionTwo = null;
        var counterAtInstructionThree = null;

        theMachine.addInstruction(Instruction_Exec, function () { counterAtInstructionOne = counter; counter++; });
        theMachine.addInstruction(Instruction_Exec, function () { counterAtInstructionTwo = counter; counter++; });
        theMachine.addInstruction(Instruction_Exec, function () { counterAtInstructionThree = counter; counter++; });
        theMachine.run();

        expect(counterAtInstructionOne).toEqual(0);
        expect(counterAtInstructionTwo).toEqual(1);
        expect(counterAtInstructionThree).toEqual(2);
        expect(theMachine.getInstructionPointer()).toEqual(3);
    });

    it("can include no-op instructions in programs, which'll do nothing", function () {
        var didInstructionARun = false;
        var didInstructionBRun = false;

        theMachine.addInstruction(Instruction_NoOp);
        theMachine.addInstruction(Instruction_Exec, function () { didInstructionARun = true; });
        theMachine.addInstruction(Instruction_NoOp);
        theMachine.addInstruction(Instruction_Exec, function () { didInstructionBRun = true; });
        theMachine.addInstruction(Instruction_NoOp);
        theMachine.run();
        
        expect(didInstructionARun).toBeTruthy();
        expect(didInstructionBRun).toBeTruthy();
    });
    
    it("can single-step through part of a program", function () {
        var didInstructionARun = false;
        var didInstructionBRun = false;
        var didInstructionCRun = false;

        theMachine.addInstruction(Instruction_Exec, function () { didInstructionARun = true; });
        theMachine.addInstruction(Instruction_Exec, function () { didInstructionBRun = true; });
        theMachine.addInstruction(Instruction_Exec, function () { didInstructionCRun = true; });
        theMachine.cycle();
        theMachine.cycle();
        
        expect(didInstructionARun).toBeTruthy();
        expect(didInstructionBRun).toBeTruthy();
        expect(didInstructionCRun).toBeFalsy();
    });

    it("allows program positions to be tagged", function () {
        theMachine.setTag("abc");
        theMachine.addInstruction(Instruction_NoOp);    // Instruction #0
        theMachine.setTag("def");
        theMachine.addInstruction(Instruction_NoOp);    // Instruction #1
        theMachine.addInstruction(Instruction_NoOp);    // Instruction #2
        theMachine.setTag("hji");
        theMachine.addInstruction(Instruction_NoOp);    // Instruction #3
        theMachine.setTag(123);
        theMachine.addInstruction(Instruction_NoOp);    // Instruction #4
        theMachine.setTag("the end");
        
        expect(theMachine.getTag("abc")).toEqual(0);
        expect(theMachine.getTag("def")).toEqual(1);
        expect(theMachine.getTag("hji")).toEqual(3);
        expect(theMachine.getTag("123")).toEqual(4);
        expect(theMachine.getTag("the end")).toEqual(5);    // The true end of a program is one-past the last available instruction.
    });
    
    it("allows programs to jump to tagged positions", function () {
        var didInstructionARun = false;
        var didInstructionBRun = false;
        var didInstructionCRun = false;
        
        theMachine.addInstruction(Instruction_Exec, function () { didInstructionARun = true; });    // Instruction #0
        theMachine.addInstruction(Instruction_JumpToTag, "last part");                              // Instruction #1
        theMachine.addInstruction(Instruction_Exec, function () { didInstructionBRun = true; });    // Instruction #2
        theMachine.setTag("last part");
        theMachine.addInstruction(Instruction_Exec, function () { didInstructionCRun = true; });    // Instruction #3
        theMachine.run();
        
        expect(didInstructionARun).toBeTruthy();
        expect(didInstructionBRun).toBeFalsy();
        expect(didInstructionCRun).toBeTruthy();
    })
    
    it("allows branching via the Exec instruction argument's return value", function () {
        var aFlag = false;
        var results = [];
        
        theMachine.setTag("start");
        theMachine.addInstruction(Instruction_Exec, function () { aFlag = !aFlag; return aFlag; });
        theMachine.addInstruction(Instruction_ConditionalJumpToTag, "is true");
        theMachine.addInstruction(Instruction_JumpToTag, "is false");
        theMachine.setTag("is true");
        theMachine.addInstruction(Instruction_Exec, function () { results.push("true"); });
        theMachine.addInstruction(Instruction_JumpToTag, "start");
        theMachine.setTag("is false");
        theMachine.addInstruction(Instruction_Exec, function () { results.push("false"); });
        theMachine.addInstruction(Instruction_JumpToTag, "start");
        
        for (var i = 0; i < 17; i++) {
            theMachine.cycle();
        }
        
        expect(results[0]).toEqual("true");
        expect(results[1]).toEqual("false");
        expect(results[2]).toEqual("true");
        expect(results[3]).toEqual("false");
    });
})
