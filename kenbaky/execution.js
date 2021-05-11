function execute(state) {
  const pointer = state.memory[state.regP]
  const instruction = state.memory[pointer]
  const i = fill(dec2oct(instruction), 3)
  switch (i) {
    // IMMEDIATE OPERATIONS
    case '003': // regA SUM IMMED
      state.memory[state.regA] += state.memory[state.memory[state.regP]+1]
      break
    case '103': // regB SUM IMMED
      state.memory[state.regB] += state.memory[state.memory[state.regP]+1]
      break
    case '203': // regX SUM IMMED
      state.memory[state.regX] += state.memory[state.memory[state.regP]+1]
      break
    case '013': // regA SUB IMMED
      state.memory[state.regA] -= state.memory[state.memory[state.regP]+1]
      break
    case '113': // regB SUB IMMED
      state.memory[state.regB] -= state.memory[state.memory[state.regP]+1]
      break
    case '213': // regX SUB IMMED
      state.memory[state.regX] -= state.memory[state.memory[state.regP]+1]
      break
    case '023': // regA LOAD IMMED
      state.memory[state.regA] = state.memory[state.memory[state.regP]+1]
      break
    case '123': // regB LOAD IMMED
      state.memory[state.regB] = state.memory[state.memory[state.regP]+1]
      break
    case '223': // regX LOAD IMMED
      state.memory[state.regX] = state.memory[state.memory[state.regP]+1]
      break
    case '033': // regA STORE IMMED
      state.memory[state.memory[state.regP]+1] = state.memory[state.regA]
      break
    case '133': // regB STORE IMMED
      state.memory[state.memory[state.regP]+1] = state.memory[state.regB]
      break
    case '233': // regX STORE IMMED
      state.memory[state.memory[state.regP]+1] = state.memory[state.regX]
      break
    case '303': // OR regA IMMED
      state.memory[state.regA] |= state.memory[state.memory[state.regA]+1]
      break
    case '313': // NOOP
      break
    case '323': // AND regA IMMED
      state.memory[state.regA] |= state.memory[state.memory[state.regA]+1]
      break
    case '333': // LNEG regA IMMED
      // ?
      break

    // MEMORY OPERATIONS
    case '004': // regA SUM MEMORY
      state.memory[state.regA] += state.memory[state.memory[state.memory[state.regP]+1]]
      break
    case '104': // regB SUM MEMORY
      state.memory[state.regB] += state.memory[state.memory[state.memory[state.regP]+1]]
      break
    case '204': // regX SUM MEMORY
      state.memory[state.regX] += state.memory[state.memory[state.memory[state.regP]+1]]
      break
    case '014': // regA SUB MEMORY
      state.memory[state.regA] -= state.memory[state.memory[state.memory[state.regP]+1]]
      break
    case '114': // regB SUB MEMORY
      state.memory[state.regB] -= state.memory[state.memory[state.memory[state.regP]+1]]
      break
    case '214': // regX SUB MEMORY
      state.memory[state.regX] -= state.memory[state.memory[state.memory[state.regP]+1]]
      break
    case '024': // regA LOAD MEMORY
      state.memory[state.regA] = state.memory[state.memory[state.memory[state.regP]+1]]
      break
    case '124': // regB LOAD MEMORY
      state.memory[state.regB] = state.memory[state.memory[state.memory[state.regP]+1]]
      break
    case '224': // regX LOAD MEMORY
      state.memory[state.regX] = state.memory[state.memory[state.memory[state.regP]+1]]
      break
    case '034': // regA STORE MEMORY
      state.memory[state.memory[state.memory[state.regP]+1]] = state.memory[state.regA]
      break
    case '134': // regB STORE MEMORY
      state.memory[state.memory[state.memory[state.regP]+1]] = state.memory[state.regB]
      break
    case '234': // regX STORE MEMORY
      state.memory[state.memory[state.memory[state.regX]+1]] = state.memory[state.regB]
      break
    case '304': // OR regA MEMORY
      state.memory[state.regA] |= state.memory[state.memory[state.memory[state.regP]+1]]
      break
    case '314': // NOOP MEMORY
      break
    case '324': // AND regA MEMORY
      state.memory[state.regA] &= state.memory[state.memory[state.memory[state.regP]+1]]
      break
    case '334': // LNEG regA MEMORY
      // ?
      break

    // // INDIRECT OPERATIONS
    // case '005': // regA SUM INDIRECT
    // case '105': // regB SUM INDIRECT
    // case '205': // regX SUM INDIRECT
    // case '015': // regA SUB INDIRECT
    // case '115': // regB SUB INDIRECT
    // case '215': // regX SUB INDIRECT
    // case '025': // regA LOAD INDIRECT
    // case '125': // regB LOAD INDIRECT
    // case '225': // regX LOAD INDIRECT
    // case '035': // regA STORE INDIRECT
    // case '135': // regB STORE INDIRECT
    // case '235': // regX STORE INDIRECT
    // case '305': // OR regA INDIRECT
    // case '315': // NOOP INDIRECT
    // case '325': // AND regA INDIRECT
    // case '335': // LNEG regA INDIRECT
    //
    // // INDEXED OPERATIONS
    // case '006': // regA SUM INDEXED
    // case '106': // regB SUM INDEXED
    // case '206': // regX SUM INDEXED
    // case '016': // regA SUB INDEXED
    // case '116': // regB SUB INDEXED
    // case '216': // regX SUB INDEXED
    // case '026': // regA LOAD INDEXED
    // case '126': // regB LOAD INDEXED
    // case '226': // regX LOAD INDEXED
    // case '036': // regA STORE INDEXED
    // case '136': // regB STORE INDEXED
    // case '236': // regX STORE INDEXED
    // case '306': // OR regA INDEXED
    // case '316': // NOOP INDEXED
    // case '326': // AND regA INDEXED
    // case '336': // LNEG regA INDEXED
    //
    // // INDIRECT/INDEXED OPERATIONS
    // case '007': // regA SUM IND/XED
    // case '107': // regB SUM IND/XED
    // case '207': // regX SUM IND/XED
    // case '017': // regA SUB IND/XED
    // case '117': // regB SUB IND/XED
    // case '217': // regX SUB IND/XED
    // case '027': // regA LOAD IND/XED
    // case '127': // regB LOAD IND/XED
    // case '227': // regX LOAD IND/XED
    // case '037': // regA STORE IND/XED
    // case '137': // regB STORE IND/XED
    // case '237': // regX STORE IND/XED
    // case '307': // OR regA IND/XED
    // case '317': // NOOP IND/XED
    // case '327': // AND regA IND/XED
    // case '337': // LNEG regA IND/XED

    // JUMPS DIRECT (same as MEMORY)
    case '043': // JUMP to IF regA != 0
      console.log('yo')
      if (state.memory[state.regA] !== 0) {
        state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      }
      break
    case '143': // JUMP to IF regB != 0
      if (state.memory[state.regB] !== 0) {
        state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      }
      break
    case '243': // JUMP to IF regX != 0
      if (state.memory[state.regX] !== 0) {
        state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      }
      break
    case '343': // JUMP to UNC
      state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      break
    case '044': // JUMP to IF regA == 0
      if (state.memory[state.regA] === 0) {
        state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      }
      break
    case '144': // JUMP to IF regB == 0
      if (state.memory[state.regB] === 0) {
        state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      }
      break
    case '244': // JUMP to IF regX == 0
      if (state.memory[state.regX] === 0) {
        state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      }
      break
    case '344': // JUMP to UNC
      state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      break
    case '045': // JUMP to IF regA < 0
      if (state.memory[state.regA] < 0) {
        state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      }
      break
    case '145': // JUMP to IF regB < 0
      if (state.memory[state.regB] < 0) {
        state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      }
      break
    case '245': // JUMP to IF regX < 0
      if (state.memory[state.regX] < 0) {
        state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      }
      break
    case '345': // JUMP to UNC
      state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      break
    case '046': // JUMP to IF regA >= 0
      if (state.memory[state.regA] >= 0) {
        state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      }
      break
    case '146': // JUMP to IF regB >= 0
      if (state.memory[state.regB] >= 0) {
        state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      }
      break
    case '246': // JUMP to IF regX >= 0
      if (state.memory[state.regX] >= 0) {
        state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      }
      break
    case '346': // JUMP to UNC
      state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      break
    case '047': // JUMP to IF regA > 0
      if (state.memory[state.regA] > 0) {
        state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      }
      break
    case '147': // JUMP to IF regB > 0
      if (state.memory[state.regB] > 0) {
        state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      }
      break
    case '247': // JUMP to IF regX > 0
      if (state.memory[state.regX] > 0) {
        state.memory[state.regP] = state.memory[state.memory[state.regP]+1]-2 // XXX
      }
      break
    case '347': // JUMP to UNC

    // // JUMPS INDIRECT (same as INDIRECT)
    // case '053': // JUMP to IF regA != 0
    // case '153': // JUMP to IF regB != 0
    // case '253': // JUMP to IF regX != 0
    // case '353': // JUMP to UNC
    // case '054': // JUMP to IF regA == 0
    // case '154': // JUMP to IF regB == 0
    // case '254': // JUMP to IF regX == 0
    // case '354': // JUMP to UNC
    // case '055': // JUMP to IF regA < 0
    // case '155': // JUMP to IF regB < 0
    // case '255': // JUMP to IF regX < 0
    // case '355': // JUMP to UNC
    // case '056': // JUMP to IF regA >= 0
    // case '156': // JUMP to IF regB >= 0
    // case '256': // JUMP to IF regX >= 0
    // case '356': // JUMP to UNC
    // case '057': // JUMP to IF regA > 0
    // case '157': // JUMP to IF regB > 0
    // case '257': // JUMP to IF regX > 0
    // case '357': // JUMP to UNC
    //
    // // JUMPS MARK DIRECT (same as MEMORY, store regP+2)
    // case '063': // JUMP to IF regA != 0
    // case '163': // JUMP to IF regB != 0
    // case '263': // JUMP to IF regX != 0
    // case '363': // JUMP to UNC
    // case '064': // JUMP to IF regA == 0
    // case '164': // JUMP to IF regB == 0
    // case '264': // JUMP to IF regX == 0
    // case '364': // JUMP to UNC
    // case '065': // JUMP to IF regA < 0
    // case '165': // JUMP to IF regB < 0
    // case '265': // JUMP to IF regX < 0
    // case '365': // JUMP to UNC
    // case '066': // JUMP to IF regA >= 0
    // case '166': // JUMP to IF regB >= 0
    // case '266': // JUMP to IF regX >= 0
    // case '366': // JUMP to UNC
    // case '067': // JUMP to IF regA > 0
    // case '167': // JUMP to IF regB > 0
    // case '267': // JUMP to IF regX > 0
    // case '367': // JUMP to UNC
    //
    // // JUMPS MARK INDIRECT (same as MEMORY, store regP+2)
    // case '073': // JUMP to IF regA != 0
    // case '173': // JUMP to IF regB != 0
    // case '273': // JUMP to IF regX != 0
    // case '373': // JUMP to UNC
    // case '074': // JUMP to IF regA == 0
    // case '174': // JUMP to IF regB == 0
    // case '274': // JUMP to IF regX == 0
    // case '374': // JUMP to UNC
    // case '075': // JUMP to IF regA < 0
    // case '175': // JUMP to IF regB < 0
    // case '275': // JUMP to IF regX < 0
    // case '375': // JUMP to UNC
    // case '076': // JUMP to IF regA >= 0
    // case '176': // JUMP to IF regB >= 0
    // case '276': // JUMP to IF regX >= 0
    // case '376': // JUMP to UNC
    // case '077': // JUMP to IF regA > 0
    // case '177': // JUMP to IF regB > 0
    // case '277': // JUMP to IF regX > 0
    // case '377': // JUMP to UNC

    // SET
    case '002': // SET 0 to bit0
    case '012': // SET 0 to bit1
    case '022': // SET 0 to bit2
    case '032': // SET 0 to bit3
    case '042': // SET 0 to bit4
    case '052': // SET 0 to bit5
    case '062': // SET 0 to bit6
    case '072': // SET 0 to bit7
    case '102': // SET 1 to bit0
    case '112': // SET 1 to bit1
    case '122': // SET 1 to bit2
    case '132': // SET 1 to bit3
    case '142': // SET 1 to bit4
    case '152': // SET 1 to bit5
    case '162': // SET 1 to bit6
    case '172': // SET 1 to bit7
    case '202': // SKIP if bit0 is 0
    case '212': // SKIP if bit1 is 0
    case '222': // SKIP if bit2 is 0
    case '232': // SKIP if bit3 is 0
    case '242': // SKIP if bit4 is 0
    case '252': // SKIP if bit5 is 0
    case '262': // SKIP if bit6 is 0
    case '272': // SKIP if bit7 is 0
    case '302': // SKIP if bit0 is 1
    case '312': // SKIP if bit1 is 1
    case '322': // SKIP if bit2 is 1
    case '332': // SKIP if bit3 is 1
    case '342': // SKIP if bit4 is 1
    case '352': // SKIP if bit5 is 1
    case '362': // SKIP if bit6 is 1
    case '372': // SKIP if bit7 is 1

    // SHIFT and ROTATE
    case '011': // RIGHT SHIFT 1 PLC regA
    case '021': // RIGHT SHIFT 2 PLC regA
    case '031': // RIGHT SHIFT 3 PLC regA
    case '001': // RIGHT SHIFT 4 PLC regA
    case '051': // RIGHT SHIFT 1 PLC regB
    case '061': // RIGHT SHIFT 2 PLC regB
    case '071': // RIGHT SHIFT 3 PLC regB
    case '041': // RIGHT SHIFT 4 PLC regB
    case '111': // RIGHT ROTATE 1 PLC regA
    case '121': // RIGHT ROTATE 2 PLC regA
    case '131': // RIGHT ROTATE 3 PLC regA
    case '101': // RIGHT ROTATE 4 PLC regA
    case '151': // RIGHT ROTATE 1 PLC regB
    case '161': // RIGHT ROTATE 2 PLC regB
    case '171': // RIGHT ROTATE 3 PLC regB
    case '141': // RIGHT ROTATE 4 PLC regB
    case '211': // LEFT SHIFT 1 PLC regA
    case '221': // LEFT SHIFT 2 PLC regA
    case '231': // LEFT SHIFT 3 PLC regA
    case '201': // LEFT SHIFT 4 PLC regA
    case '251': // LEFT SHIFT 1 PLC regB
    case '261': // LEFT SHIFT 2 PLC regB
    case '271': // LEFT SHIFT 3 PLC regB
    case '241': // LEFT SHIFT 4 PLC regB
    case '311': // LEFT ROTATE 1 PLC regA
    case '321': // LEFT ROTATE 2 PLC regA
    case '331': // LEFT ROTATE 3 PLC regA
    case '301': // LEFT ROTATE 4 PLC regA
    case '351': // LEFT ROTATE 1 PLC regB
    case '361': // LEFT ROTATE 2 PLC regB
    case '371': // LEFT ROTATE 3 PLC regB
    case '341': // LEFT ROTATE 4 PLC regB

    // MISC
    case '000': // HALT
      state.running = false
      clearInterval(state.runInterval)
      break;
    case '200': // NOOP
    default:

  }

  state.memory[state.regP] += 2
  state.memory[state.regP] %= 256
  emit('render')
  return state
}
