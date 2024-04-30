document.addEventListener('DOMContentLoaded', function() {
  var activitiesContainer = document.querySelector('#js-activities-container');
  var subElement = activitiesContainer.querySelectorAll('.timeline-panel');
  
  var elementsArray = Array.from(subElement);  // Converte NodeList para Array

    // Agora você pode usar map, filter, etc.
    elementsArray.map(element => {
      const title = element.querySelector('span').textContent.trim().split('    ')[0].replaceAll(/\n/g, '');
      
      const arrayperiodos = Array.from(element.querySelectorAll('small'))[1].textContent.trim().split('    ')
      
      const subTitle = Array.from(element.querySelectorAll('small'))[0].textContent.trim().split('    ')[0].replace('  ', ' ')
      
      const periodo = arrayperiodos[arrayperiodos.length - 1].trim().replace('Período:', '').trim()

      console.log({title,subTitle, periodo});
    });
});