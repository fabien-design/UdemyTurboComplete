const courseId = prompt('Please enter the course ID:');

const url = `https://www.udemy.com/api-2.0/courses/${courseId}/subscriber-curriculum-items/?page_size=200&fields[lecture]=title,id&fields[quiz]=title,id&fields[practice]=title,id&fields[chapter]=title,id`;
// get all course steps ids 
fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const objectIds = [];

        data.results.forEach(item => {
            if (item.id !== undefined) {
                objectIds.push(item.id);
            }
        });
        // send a POST request to complete each step
        const requests = objectIds.map(id => {
            return fetch(`https://www.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/completed-lectures/`, {
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US",
                    "cache-control": "no-cache",
                    "content-type": "application/json",
                    "pragma": "no-cache",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                },
                referrer: `https://www.udemy.com/course/python-web-scraping-data-extraction-with-beautiful-soup/learn/lecture/40155652?start=0`,
                referrerPolicy: "strict-origin-when-cross-origin",
                body: JSON.stringify({ lecture_id: id, downloaded: false }),
                method: "POST",
                mode: "cors",
                credentials: "include"
            }).then(postResponse => {
                if (!postResponse.ok) {
                    throw new Error('Network response was not ok ' + postResponse.statusText);
                }
                return postResponse.json();
            }).then(postData => {
                console.log(`Successfully posted lecture_id ${id}`);
            }).catch(postError => {
                console.error(`There was a problem with the POST operation for lecture_id ${id}:`, postError);
            });
        });

        // Wait for all requests to be resolved
        return Promise.all(requests);
    })
    .then(() => {
        // Once all requests are completed, display the alert
        alert('All requests have been successfully sent!');
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
