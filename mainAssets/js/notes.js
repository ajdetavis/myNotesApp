const notesHandler = () => {

  let data = [];

  const NoteObject = function (title, author, body) { //Constructor to create new "note" objects
  
    this.title = title;
    this.date = theDate();
    this.author = author;
    this.body = body;
    
  };
  
  const sendToStorage = (theData) => {
    const dataJSON = JSON.stringify(theData);
    
    window.localStorage.setItem('notes', dataJSON);
  };
  
  const theDate = () => { //function that retuns today's month day and year in a string
    const d = new Date();
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    
    return `${month} / ${day} / ${year}`;
  };
    
  return { //Export anything used in another function
    data: data,
    sendToStorage: sendToStorage,
    noteObject: NoteObject,
  };
  
};




const UIHandler = () => {
  
  const theDOM = {
    header: 'header',
    mainTitle: 'mainTitle',
    subTitle:  'subTitle',
    app: 'app',
    theBtn: 'theBtn',
    sidebarBtn: 'sidebarBtn',
    notesList: 'notesList',
    titleField: 'titleField',
    authorField: 'authorField',
    bodyField: 'bodyField',
    addNoteBtn: 'addNoteBtn',
    deleteBtn: 'deleteBtn'
  };
  
  const formHTML = '<form><div class="row gtr-uniform"><div class="col-6 col-12-xsmall"><input type="text" id="titleField" value="" placeholder="Note Title" /></div><div class="col-6 col-12-xsmall"><input type="text" id="authorField" value="" placeholder="Your Name" /></div><!-- Break --><div class="col-12"><textarea id="bodyField" placeholder="Enter your note" rows="6"></textarea></div><!-- Break --><div class="col-12"><ul class="actions"><li><a id="addNoteBtn" class="button primary big">Add Note</a></li></ul></div></div></form>';
  const formHeaderHTML = '<a href="https://github.com/ajdetavis/myNotesApp" class="logo"><strong>Notes App</strong> by ajdetavis</a>';
  const emptyListHTML = '<li><a>No notes to show</a></li>';
  const listItemHTML = '<li class="noteItem"><a>%title%</a></li>';
  const noteHTML = '<p>%body%</p><ul class="actions"><li><a id="deleteBtn" class="button big">Delete this note</a></li></ul>';
  const noteHeaderHTML = '<a class="logo"><strong>%date%</strong> by %author%</a>';

  
  const showForm = () => {
    document.getElementById(theDOM.mainTitle).textContent = "Add a new note";
    document.getElementById(theDOM.subTitle).textContent = 'Type your note in the box below and then click "Add"';
    document.getElementById(theDOM.header).innerHTML = formHeaderHTML;
    document.getElementById(theDOM.app).innerHTML = formHTML;

  }
  
  const getFormData = () => {
    let theTitle = document.getElementById(theDOM.titleField).value;
    let theAuthor = document.getElementById(theDOM.authorField).value;
    let theBody = document.getElementById(theDOM.bodyField).value;
    
    return {
      title: theTitle,
      author: theAuthor,
      body: theBody
    }
  };
  
  const clearForm = () => {
    document.getElementById(theDOM.titleField).value = '';
    document.getElementById(theDOM.authorField).value = '';
    document.getElementById(theDOM.bodyField).value = '';
    document.getElementById(theDOM.titleField).focus();
  }
  
  const updateSideBar = (data) => {
    if (data.length === 0) {
      document.getElementById(theDOM.notesList).innerHTML = emptyListHTML;
    } else {
      document.getElementById(theDOM.notesList).innerHTML = '';
      
      let sidebarHTML = '';
      
      data.forEach((c) => {
        sidebarHTML += listItemHTML.replace('%title%', c.title);
      });
      
      document.getElementById(theDOM.notesList).innerHTML = sidebarHTML;
    }
  };
  
  const showNote = (data, index) => {
    const headerHTML = noteHeaderHTML.replace('%author%', data[index].author);
    
    document.getElementById(theDOM.header).innerHTML = headerHTML.replace('%date%', data[index].date);
    document.getElementById(theDOM.mainTitle).textContent = data[index].title;
    document.getElementById(theDOM.subTitle).style.display = 'none';
    document.getElementById(theDOM.app).innerHTML = noteHTML.replace('%body%', data[index].body);
  }
  
  const showDeletedMessage = () => {
    document.getElementById(theDOM.header).innerHTML = formHeaderHTML;
    document.getElementById(theDOM.mainTitle).textContent = '';
    document.getElementById(theDOM.subTitle).style.display = 'none';
    document.getElementById(theDOM.app).innerHTML = '<p><strong>This note is deleted</strong></p>';
  }
  
  
  return {
    theDOM: theDOM,
    showForm: showForm,
    getFormData: getFormData,
    clearForm: clearForm,
    updateSideBar: updateSideBar,
    showNote: showNote, 
    showDeletedMessage: showDeletedMessage
  }
  

};




const appHandler = (notes, UI) => {

////////App Handler Variables
  const DOM = UI.theDOM;
  
  let notesListArr;
  
///////App Handler Functions
  const makeNewNote = (titleStr, authorStr, bodyStr) => {
    return new notes.noteObject(titleStr, authorStr, bodyStr);
  };
  
  const prepForm = (func) => {
    
    UI.showForm();
    document.getElementById(DOM.addNoteBtn).addEventListener('click', addNoteClicked);
    
  };
  
  const refreshSidebar = () => {
    UI.updateSideBar(notes.data);
    
    setNotesList();
    
    notesListListeners();
  };
  
  const setNotesList = () => notesListArr = Array.from(document.querySelectorAll('.noteItem'));
  
  const removeNote = () => {
    const theTitle = document.getElementById(DOM.mainTitle).textContent;
    const newData = notes.data.filter((c) => c.title !== theTitle);
    
    notes.data = newData;
    
    UI.showDeletedMessage();
    
    refreshSidebar();
    
    notes.sendToStorage(notes.data);
  };
  
  const notesListListeners = () => {
    
    notesListArr.forEach((c) => {
      
      c.addEventListener('click', () => { 
        UI.showNote(notes.data, notesListArr.indexOf(c));
        document.getElementById(DOM.deleteBtn).addEventListener('click', removeNote);
      });
      
    });
  };
  
  
  const addNoteClicked = () => {
    
    if (UI.getFormData().title && UI.getFormData().author && UI.getFormData().body) {
      let currentData = notes.data;
    
      currentData.push(makeNewNote(UI.getFormData().title, UI.getFormData().author, UI.getFormData().body));

      notes.data = currentData;

      UI.clearForm();

      refreshSidebar();

      notes.sendToStorage(notes.data);
    } else {
      alert('Please fill out all of the fields');
    }
    
  };
  
////////Startup Sequence
  if (window.localStorage.getItem('notes') !== null) {
    notes.data = JSON.parse(window.localStorage.getItem('notes'));
  
    refreshSidebar();
  }
  
  document.getElementById(DOM.theBtn).addEventListener('click', prepForm);
  document.getElementById(DOM.sidebarBtn).addEventListener('click', prepForm);
  
  console.log('The app has started');

};

appHandler(notesHandler(), UIHandler());