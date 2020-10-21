# -s EXPORTED_FUNCTIONS='["_getTile","_setTile","_eraseTile","_setMode","_selectColor","_selectEvent","_selectSlot","_setRule","_eraseRule","_setCursor","_applyRules","_eraseMemory","_eraseRules"]' \
emcc colormachine.c -s WASM=1 \
-s EXPORTED_FUNCTIONS='["_getTile","_setTile","_getCursorX","_getCursorY","_getSelectedColor","_getSelectedEvent","_getSelectedSlot","_getView","_eraseTile","_setMode","_selectColor","_selectEvent","_selectSlot","_setRule","_eraseRule","_setCursor","_applyRules","_eraseMemory","_eraseRules"]' \
-s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']" \
-o colormachine.html
