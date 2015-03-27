// Load vacancies from hh.ru
var employer_id = 1455;

var $Vacancies = document.getElementById('Vacancies');
var noVacancies = function(){
    $Vacancies.innerHTML = '';
    document.getElementById('NoVacancies').style.display = 'block';
};
if(window.XMLHttpRequest){
    var vacanciesDataUrl = 'https://api.hh.ru/vacancies?employer_id=' + employer_id,
        vacanciesTmplUrl = 'ajax/vacancy.html';

    var request = function(url, successCallback){
        var r = new XMLHttpRequest();
        r.open('GET', url, true);

        r.onload = successCallback;

        r.send();
    }

    $Vacancies.innerHTML = '<p>Loading vacancies from hh.ru...</p>';

    request(vacanciesDataUrl, function(){
        var dataRequest = this;

        if(dataRequest.status < 200 || dataRequest.status >= 400){
            noVacancies();
        }

        var data = JSON.parse(dataRequest.responseText);

        if(!data.found || !data.items){
            noVacancies();
        }

        request(vacanciesTmplUrl, function(){
            var tmplRequest = this;

            if(tmplRequest.status < 200 || tmplRequest.status >= 400){
                noVacancies();
            }

            var tmpl = tmplRequest.responseText;

            var output = '';
            for(var i = 0; i < data.items.length; i++){
                var out = tmpl,
                    vacancy = data.items[i];

                vacancy = {
                    name: vacancy.name,
                    published_at: vacancy.published_at.replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})(.*)/, '$3.$2.$1'),
                    url: vacancy.alternate_url,
                    salary: vacancy.salary ? vacancy.salary.from : '?',
                    city: vacancy.area.name
                }

                for(var field in vacancy){
                    out = out.replace('${' + field + '}', vacancy[field]);
                }

                output += out;
            }
            $Vacancies.innerHTML = output;
        });
    });
} else{
    noVacancies();
}