export const selectInlineInputValue = (e) => {
  e.target.focus();
  e.target.select();
  // document.execCommand("selectAll", false, null);
};

export const saveContentAfterPressEnter = (e) => {
  if (e.key === "Enter") e.target.blur();
};
