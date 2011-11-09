describe("Machine", function () {
    var theMachine = null;
    
    beforeEach(function () {
        theMachine = new Machine();
    });
    
    it("has an instruction pointer, which starts at zero", function () {
        expect(theMachine.getInstructionPointer()).toEqual(0);
    });
    
	describe("Program Management and Code Execution", function () {
		var theProgram = null;
		
		beforeEach(function () {
			theProgram = new Program();
		})
		
		it("can have a program loaded into it, but doesn't by default", function () {
			expect(theMachine.getProgram()).toBeNull();
		});
		
		it("can have a program loaded into it", function () {
			theMachine.loadProgram(theProgram);
			expect(theMachine.getProgram()).toBe(theProgram);
		});
		
		it("can be run without any program attached", function () {
	        theMachine.run();
	    });
	
	    it("can run programs with arbitrary code via the Exec instruction", function () {
	        var didInstructionRun = false;

	        theProgram.addInstruction(Instruction_Exec, function () { didInstructionRun = true; });
			theMachine.loadProgram(theProgram);
	        theMachine.run();

	        expect(didInstructionRun).toBeTruthy();
	        expect(theMachine.getInstructionPointer()).toEqual(1);
	    });
	
		it("can pass a custom 'this' environment to Exec'ed functions", function () {
			var recordedVar = null;
			theProgram.addInstruction(Instruction_Exec, function () { recordedVar = this; });
			theMachine.loadProgram(theProgram);
			var theExecEnv = new Array();
			theMachine.setExecEnvironment(theExecEnv);
			theMachine.run();
			
			expect(recordedVar).toBe(theExecEnv);
		});
		
		/*
		it("can share a common environment to each Exec'ed function, which is null by default", function () {
			var recordedVar = null;
			theProgram.addInstruction(Instruction_Exec, function () { recordedVar = this; });
			theMachine.loadProgram(theProgram);
			theMachine.run();
			
			expect(recordedVar).toBeNull();
		});
		*/
	
		it("can run multiple instructions, in order", function () {
	        var counter = 0;
	        var counterAtInstructionOne = null;
	        var counterAtInstructionTwo = null;
	        var counterAtInstructionThree = null;

	        theProgram.addInstruction(Instruction_Exec, function () { counterAtInstructionOne = counter; counter++; });
	        theProgram.addInstruction(Instruction_Exec, function () { counterAtInstructionTwo = counter; counter++; });
	        theProgram.addInstruction(Instruction_Exec, function () { counterAtInstructionThree = counter; counter++; });
	        theMachine.loadProgram(theProgram);
			theMachine.run();

	        expect(counterAtInstructionOne).toEqual(0);
	        expect(counterAtInstructionTwo).toEqual(1);
	        expect(counterAtInstructionThree).toEqual(2);
	        expect(theMachine.getInstructionPointer()).toEqual(3);
	    });
	
		it("can include no-op instructions in programs, which'll do nothing", function () {
	        var didInstructionARun = false;
	        var didInstructionBRun = false;

	        theProgram.addInstruction(Instruction_NoOp);
	        theProgram.addInstruction(Instruction_Exec, function () { didInstructionARun = true; });
	        theProgram.addInstruction(Instruction_NoOp);
	        theProgram.addInstruction(Instruction_Exec, function () { didInstructionBRun = true; });
	        theProgram.addInstruction(Instruction_NoOp);
			theMachine.loadProgram(theProgram);
	        theMachine.run();

	        expect(didInstructionARun).toBeTruthy();
	        expect(didInstructionBRun).toBeTruthy();
	    });

	    it("can single-step through part of a program", function () {
	        var didInstructionARun = false;
	        var didInstructionBRun = false;
	        var didInstructionCRun = false;

	        theProgram.addInstruction(Instruction_Exec, function () { didInstructionARun = true; });
	        theProgram.addInstruction(Instruction_Exec, function () { didInstructionBRun = true; });
	        theProgram.addInstruction(Instruction_Exec, function () { didInstructionCRun = true; });
			theMachine.loadProgram(theProgram);
	        theMachine.cycle();
	        theMachine.cycle();

	        expect(didInstructionARun).toBeTruthy();
	        expect(didInstructionBRun).toBeTruthy();
	        expect(didInstructionCRun).toBeFalsy();
	    });
	
		it("allows programs to jump to tagged positions", function () {
	        var didInstructionARun = false;
	        var didInstructionBRun = false;
	        var didInstructionCRun = false;

	        theProgram.addInstruction(Instruction_Exec, function () { didInstructionARun = true; });    // Instruction #0
	        theProgram.addInstruction(Instruction_JumpToTag, "last part");                              // Instruction #1
	        theProgram.addInstruction(Instruction_Exec, function () { didInstructionBRun = true; });    // Instruction #2
	        theProgram.setTag("last part");
	        theProgram.addInstruction(Instruction_Exec, function () { didInstructionCRun = true; });    // Instruction #3
			theMachine.loadProgram(theProgram);
	        theMachine.run();

	        expect(didInstructionARun).toBeTruthy();
	        expect(didInstructionBRun).toBeFalsy();
	        expect(didInstructionCRun).toBeTruthy();
	    });
	
		it("allows branching via the Exec instruction argument's return value", function () {
	        var aFlag = false;
	        var results = [];

	        theProgram.setTag("start");
	        theProgram.addInstruction(Instruction_Exec, function () { aFlag = !aFlag; return aFlag; });
	        theProgram.addInstruction(Instruction_ConditionalJumpToTag, "is true");
	        theProgram.addInstruction(Instruction_JumpToTag, "is false");
	        theProgram.setTag("is true");
	        theProgram.addInstruction(Instruction_Exec, function () { results.push("true"); });
	        theProgram.addInstruction(Instruction_JumpToTag, "start");
	        theProgram.setTag("is false");
	        theProgram.addInstruction(Instruction_Exec, function () { results.push("false"); });
	        theProgram.addInstruction(Instruction_JumpToTag, "start");

			theMachine.loadProgram(theProgram);
	        for (var i = 0; i < 17; i++) {
	            theMachine.cycle();
	        }

	        expect(results[0]).toEqual("true");
	        expect(results[1]).toEqual("false");
	        expect(results[2]).toEqual("true");
	        expect(results[3]).toEqual("false");
	    });
	});
});
