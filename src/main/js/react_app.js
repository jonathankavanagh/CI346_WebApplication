'use strict';
const React = require('react');
const ReactDOM = require('react-dom')
const client = require('./client');
const follow = require('./follow');
const root = '/api';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {workers: [], attributes: [], pageSize: [], links: {}};
		this.Update = this.Update.bind(this);
		this.Create = this.Create.bind(this);
		this.Delete = this.Delete.bind(this);
	}

	loadFromServer(pageSize) {
		follow(client, root, [
			{rel: 'workers', params: {size: pageSize}}]).then(workerCollection => {return client({
				method: 'GET',
				path: workerCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}})
				.then(schema => { this.schema = schema.entity; return workerCollection; });})
				.done(workerCollection => { this.setState({
				workers: workerCollection.entity._embedded.workers,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: workerCollection.entity._links});
		});
	}

	Create(newWorker) {
		follow(client, root, ['workers']).then(workerCollection => {
			return client({
				method: 'POST',
				path: workerCollection.entity._links.self.href,
				entity: newWorker,
				headers: {'Content-Type': 'application/json'}
			})
		})
		.then(response => { return follow(client, root, [{rel: 'workers', params: {'size': this.state.pageSize}}]);
		})
		.done(response => {
			if (typeof response.entity._links.last == "undefined") {
				this.NavTo(response.entity._links.self.href);
			} else if (typeof response.entity._links.last != "undefined"){
				this.NavTo(response.entity._links.last.href);
			}
		});
	}

	Delete(worker) {
		client({method:'DELETE',path: worker._links.self.href}).done(response => {
			this.loadFromServer(this.state.pageSize);
		});
	}

	NavTo(navUri) {
		client({method:'GET',path: navUri}).done(workerCollection => {
			this.setState({
				workers: workerCollection.entity._embedded.workers,
				attributes: this.state.attributes,
				pageSize: this.state.pageSize,
				links: workerCollection.entity._links
			});
		});
	}

	Update(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize);
		}
	}

	componentDidMount() {
		this.loadFromServer(this.state.pageSize);
	}
	
	render() {
		return (
		<div>
		<AddWorkerDialog attributes={this.state.attributes} Create={this.Create}/>
		<WorkerList workers={this.state.workers}
		links={this.state.links}
		Delete={this.Delete}
		Update={this.Update}/>
		</div>
		)
	}
}

class WorkerList extends React.Component {
	constructor(props) {
		super(props);
	}
	handleInput(e) {
		e.preventDefault();
		var pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
			this.props.Update(pageSize);
	}
	render() {
		var workers = this.props.workers.map(worker =>
			<Worker key={worker._links.self.href} worker={worker} Delete={this.props.Delete}/>
		);
		return (
			<div>
			<table>
			<tbody>
				<tr>
					<th>Name</th>
					<th>Day</th>
					<th>Period</th>
					<th>Start Time</th>
					<th>End Time</th>
					<th></th>
				</tr>
			{workers}
			</tbody>
			</table>
			<div>
			</div>
			</div>
		)
	}
}

class Worker extends React.Component {
	constructor(props) {
		super(props);
		this.doDelete = this.doDelete.bind(this);
	}
	
	doDelete() {
		this.props.Delete(this.props.worker);
	}
	render() {
		return (
			<tr>
			<td>{this.props.worker.name}</td>
			<td>{this.props.worker.day}</td>
			<td>{this.props.worker.period}</td>
			<td>{this.props.worker.startTime}</td>
			<td>{this.props.worker.endTime}</td>
			<td><button onClick={this.doDelete}>Delete</button></td>
			</tr>
		)
	}
}

class AddWorkerDialog extends React.Component {
	constructor(props) {
		super(props);
		this.doCreate = this.doCreate.bind(this);
	}
	doCreate(e) {
		e.preventDefault();
		var newWorker = {};
		this.props.attributes.forEach(attribute => {newWorker[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value;
		});
		this.props.Create(newWorker);
		this.props.attributes.forEach(attribute => { ReactDOM.findDOMNode(this.refs[attribute]).value});
		window.location = "#";
	}

	render() {
		var inputs = this.props.attributes.map(attribute =>
			<p key={attribute}><input type="text" placeholder={attribute} ref={attribute} className="field" /></p>
		);
		return (
			<div id="link">
			<a href="#addShift">Create Shift</a>
			<div id="addShift" className="addDialog">
			<div>
				<a href="#" title="Close" className="close">CLOSE</a>
				<h3>Create A New Shift</h3>
				<form>{inputs}<button onClick={this.doCreate}>Create Shift</button></form>
			</div>
			</div>
			</div>
		)
	}

}

ReactDOM.render(<App/>,document.getElementById('react-content'))