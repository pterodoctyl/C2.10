$('.vote-result-message').hide();

$('.results-diagram').hide();

$('.results').click(() => {
	$('.results-diagram').show();
	$('.vote-result-message').hide();
});

$('.dogs').click(() => {
	postVote('dogs');
})

$('.cats').click(() => {
	postVote('cats');
})

$('.parrots').click(() => {
	postVote('parrots');
})

function postVote(pet) {
	$.post(`https://sf-pyw.mosyag.in//sse/vote/${pet}`, function(data){
		if(data.message == "Ok"){
			console.log(data.message)
			$('.vote-result-message').show();	
		}
	});

	$('.vote-form').hide();
}

const header = new Headers({
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*'
})

const url = new URL('https://sf-pyw.mosyag.in/sse/vote/stats')

const ES = new EventSource(url, header)

ES.onerror = error => {
    ES.readyState ? $('.results-diagram').html("<h3>Server Error</h3>") : null;
}

ES.onmessage = message => {
	voteRes = JSON.parse(message.data)
	dogsVotesPersent =  (voteRes.dogs * 100/(voteRes.dogs + voteRes.cats + voteRes.parrots)).toFixed(2);
	catsVotesPersent =  (voteRes.cats * 100/(voteRes.dogs + voteRes.cats + voteRes.parrots)).toFixed(2);
	parrotsVotesPersent =  (voteRes.parrots * 100/(voteRes.dogs + voteRes.cats + voteRes.parrots)).toFixed(2);
	
	console.log(`Dogs - ${dogsVotesPersent}% (${voteRes.dogs})\nCats - ${catsVotesPersent}% (${voteRes.cats})\nParrots - ${parrotsVotesPersent}% (${voteRes.parrots})`);
	
	$('.dogs-pg').css('width', `${dogsVotesPersent}%`).attr('aria-valuenow', dogsVotesPersent).text(`Собаки - ${dogsVotesPersent}%`);

	$('.cats-pg').css('width', `${catsVotesPersent}%`).attr('aria-valuenow', catsVotesPersent).text(`Кошки - ${catsVotesPersent}%`);

	$('.parrots-pg').css('width', `${parrotsVotesPersent}%`).attr('aria-valuenow', parrotsVotesPersent).text(`Попугаи - ${parrotsVotesPersent}%`);
}