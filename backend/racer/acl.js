module.exports = {
  todos: {
    create: [ everybody ],
    read: [ everybody ],
    update: [ todoOwner ],
    delete: [ todoOwner ],
  }
}

function everybody( cb ){ cb( true ) }
function todoOwner( cb ){ cb( false ) }
