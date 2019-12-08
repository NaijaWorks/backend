const graphql = require('graphql');
const User = require('../models/user');
const Project = require('../models/project');
const Skill = require('../models/skill');

// grabbing the required properties from the graphql package
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLBoolean } = graphql;

// defining the object types
const UserType = new GraphQLObjectType({
   name: 'User',
   fields: () => ({
      id: { type: GraphQLID },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      photoURL: { type: GraphQLString },
      email: { type: GraphQLString },
      showEmail: { type: GraphQLBoolean },
      phone: { type: GraphQLString },
      showPhone: { type: GraphQLBoolean },
      password: { type: GraphQLString },
      location: { type: GraphQLString },
      role: { type: GraphQLString },
      shortBio: { type: GraphQLString },
      longBio: { type: GraphQLString },
      skills: {
         type: new GraphQLList(SkillType),
         resolve(parent, args) {
            return Skill.find({ userId: parent.id })
         }
      },
      projects: {
         type: new GraphQLList(ProjectType),
         resolve(parent, args) {
            return Project.find({ userId: parent.id });
         }
      }
   })
})

const SkillType = new GraphQLObjectType({
   name: 'Skill',
   fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      logo: { type: GraphQLString },
      user: {
         type: UserType,
         resolve(parent, args) {
            return User.findById(parent.userId)
         }
      }
   })
})

const ProjectType = new GraphQLObjectType({
   name: 'Project',
   fields: () => ({
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      imageURL: { type: GraphQLString },
      description: { type: GraphQLString },
      projectURL: { type: GraphQLString },
      user: {
         type: UserType,
         resolve(parent, args) {
            return User.findById(parent.userId)
         }
      }
   })
})

// step 3: define the root query which shows how we can initially jump into the graph
const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {
      user: {
         type: UserType,
         args: {
            id: { type: GraphQLID }
         },
         resolve(parent, args) {
            return User.findById(args.id);
         }
      },
      project: {
         type: ProjectType,
         args: {
            id: { type: GraphQLID }
         },
         resolve(parent, args) {
            return Project.findById(args.id);
         }
      },
      users: {
         type: new GraphQLList(UserType),
         resolve(parent, args) {
            return User.find({});
         }
      },
      projects: {
         type: new GraphQLList(ProjectType),
         resolve(parent, args) {
            return Project.find({});
         }
      }

   }
})

const Mutation = new GraphQLObjectType({
   name: 'Mutation',
   fields: {
      addProject: {
         type: ProjectType,
         args: {
            title: { type: new GraphQLNonNull(GraphQLString) },
            imageURL: { type: GraphQLString },
            description: { type: new GraphQLNonNull(GraphQLString) },
            projectURL: { type: GraphQLString },
            userId: { type: new GraphQLNonNull(GraphQLID) }
         },
         resolve(parent, args) {
            let project = new Project({
               title: args.title,
               imageUrl: args.imageURL,
               description: args.description,
               projectURL: args.projectURL,
               userId: args.userId
            });
            return project.save();
         }
      },
      addSkill: {
         type: SkillType,
         args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            logo: { type: GraphQLString },
            userId: { type: new GraphQLNonNull(GraphQLID) }
         },
         resolve(parent, args) {
            let skill = new Skill({
               name: args.name,
               logo: args.logo,
               userId: args.userId
            });
            return skill.save();
         }
      },
      addUser: {
         type: UserType,
         args: {
            firstName: { type: new GraphQLNonNull(GraphQLString) },
            lastName: { type: new GraphQLNonNull(GraphQLString) },
            photoURL: { type: GraphQLString },
            email: { type: new GraphQLNonNull(GraphQLString) },
            showEmail: { type: new GraphQLNonNull(GraphQLBoolean) },
            phone: { type: new GraphQLNonNull(GraphQLString) },
            showPhone: { type: new GraphQLNonNull(GraphQLBoolean) },
            password: { type: new GraphQLNonNull(GraphQLString) },
            location: { type: new GraphQLNonNull(GraphQLString) },
            role: { type: new GraphQLNonNull(GraphQLString) },
            shortBio: { type: new GraphQLNonNull(GraphQLString) },
            longBio: { type: GraphQLString },
         },
         resolve(parent, args) {
            let user = new User({
               firstName: args.firstName,
               lastName: args.lastName,
               photoURL: args.photoURL,
               email: args.email,
               showEmail: args.showEmail,
               phone: args.phone,
               showPhone: args.showPhone,
               password: args.password,
               location: args.location,
               role: args.role,
               shortBio: args.shortBio,
               longBio: args.longBio,
            });
            return user.save();
         }
      }
   }
})

module.exports = new GraphQLSchema({
   query: RootQuery,
   mutation: Mutation
})