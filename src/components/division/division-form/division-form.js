import React from 'react';
import {AgeGroupList, ClassificationSelect} from '../../select-box';

export default class DivisionForm extends  React.Component{
  constructor(props){
    super(props);
    this.state = {
      _id: this.props.division._id || '',
      agegroup: this.props.division.agegroup || '',
      classification: this.props.division.classification || '',
      name: this.props.division.name || '',
      nameError: null,
      agegroupError: null,
      classificationError: null,
      edit: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleInvokeEdit = this.handleInvokeEdit.bind(this);
  }

  componentDidMount(){
    if(!Object.keys(this.props.division).length) return this.setState({edit: true});
  }

  componentWillReceiveProps(nextProps){
    if(!nextProps.division) return this.setState({edit: true});
    this.setState({
      _id: nextProps.division._id,
      agegroup: nextProps.division.agegroup,
      classification: nextProps.division.classification,
      name: nextProps.division.name,
      nameError: null,
      agegroupError: null,
      classificationError: null,
      edit: nextProps.isCollapsed ? false : this.state.edit,
    });
  }

  getClassifications(){
    return (this.props.teams) ? Object.keys(this.props.teams) : [];
  }

  toggleEdit(){
    this.setState({edit: !this.state.edit});
  }

  handleInvokeEdit(){
    if(!this.state.edit)
      this.setState({edit: true});
  }

  handleCancel(){
    if (!this.state._id) return this.props.removeDivision();
    this.setState({
      edit: !this.state.edit,
      name: this.props.division.name || '',
      agegroup: this.props.division.agegroup || '',
      classification: this.props.division.classification || '',
      nameError: null,
      agegroupError: null,
      classificationError: null,
    });
  }
  
  handleChange(e){
    let {name, value} = e.target;
    this.setState({
      [name]: name !== 'name' ? value.trim() : value,
      [`${name}Error`]: null,
    });
  }

  handleDelete(e){
    e.preventDefault();
    if(!this.state._id) {
      //this.props.removeDivision();
      this.setState({agegroup: '', classification: '', name: '', _id: ''});
      return;
    }
    return this.props.onDelete({...this.state, tournament: this.props.tournament._id});    
  }

  isFormValid(){
    let nameError = !this.state.name.trim() ? 'Division name required' : null;
    let classificationError = !this.state.classification ? 'Classification required' : null;
    let agegroupError = !this.state.agegroup ? 'Age group required' : null;
    this.setState({nameError, classificationError, agegroupError});
    return [nameError, classificationError, agegroupError].every(error => !error);
  }

  handleSubmit(e){
    e.preventDefault();
    //if (!this.state.name || !this.state.classification || !this.state.agegroup ) return;
    if (!this.isFormValid()) return;
    let division = {...this.state};
    delete division.edit;
    if (division._id === '') delete division._id;
    if (!division.tournament) division.tournament = this.props.tournament._id;
    this.props.onComplete(division)
      .then(() => this.setState({edit: false}));
  }

  render(){
    return(
      <form className={`division-form${this.state.edit ? ' edit' : ''}`} name="division" onSubmit={this.handleSubmit}>
        <input name="name"
          placeholder="Division Name"  
          type="text"
          className={this.state.nameError ? 'error' : ''}
          onChange={this.handleChange}
          onDoubleClick={this.handleInvokeEdit}
          value={this.state.name}
          readOnly={!this.state.edit}
        />

        {this.state.nameError ? <span className="validation-error">{this.state.nameError}</span> : undefined }

        <ClassificationSelect onSelect={this.handleChange}
          textValue={this.state.classification}
          classifications={this.getClassifications()}
          edit={this.state.edit}
          invokeEdit={this.handleInvokeEdit}
          error={this.state.classificationError}/>

        {this.state.classificationError ? <span className="validation-error">{this.state.classificationError}</span> : undefined }

        <AgeGroupList onSelect={this.handleChange} 
          textValue={this.state.agegroup} 
          edit={this.state.edit}
          invokeEdit={this.handleInvokeEdit}
          error={this.state.agegroupError}/>

        {this.state.agegroupError ? <span className="validation-error">{this.state.agegroupError}</span> : undefined }

        <div className="division-form-btn-wrap">
          {this.state.edit ?
            <React.Fragment>
              <button onClick={this.handleDelete} type="button" name="remove" >Delete</button>
              <button type='submit' name='save'>Save</button>
              <button onClick={this.handleCancel} type="button" name="cancel" >Cancel</button>
            </React.Fragment>
            : undefined}

          {!this.state.edit ?
            <button type="edit" name="edit" onClick={this.toggleEdit}>Edit</button>
            : undefined}
        </div>
      </form>
    );
  }
}