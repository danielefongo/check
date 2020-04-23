module.exports = function(loader, toggl, timeSlotter, asker, config) {

  this.run = async () => {
    const moment = loader.load('moment')

    const granularity = await chooseGranularity(asker)
    console.log(granularity)

    const start = moment().startOf(granularity)
    const end = moment().endOf(granularity)
    const projects = await toggl.getAllProjects()

    toggl.getTimeEntries(start, end).then(entries => {
      entries.forEach(entry => {
        const project = projects.filter(project => project.id === entry.pid)[0]
        print(project, entry)
      })
    })
  }

  this.help = () => {
    return "show inserted entries"
  }
}

function print(project, entry) {
  console.log(`${entry.slot.description} on ${project.description}: "${entry.description}"`)
}

async function chooseGranularity(asker) {
  return asker.inquire('Select granularity', 'list', ['day', 'week', 'month', 'year'])
}