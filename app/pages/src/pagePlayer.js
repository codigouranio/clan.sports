import AppInfo from "./appInfo";
import LoginMenu from "./loginMenu";
import { Component, createDiv, getUrlParams, Page } from "./loveVanilla";

export default class PagePlayer extends Page {
  constructor(app, urlMatcher) {
    super(app, urlMatcher);

    this.createChild(new AppInfo("#app-info"));
    this.createChild(new PlayerInfo("#w-board"));
    this.createChild(new LoginMenu("#login-menu"));
  }

  render() {
    super.render();
  }
}

export class PlayerInfo extends Component {
  constructor(id, props) {
    super(id, props);
  }
  render() {
    const params = getUrlParams("player_name").split("_");

    const root = createDiv({
      id: "player-info",
      type: "article",
      className: "player-info-container",
    })
      .add(
        createDiv({
          className: "player-header-wrapper",
        }).add(
          createDiv({ className: "player-header" }).add(
            createDiv({ id: "player-info" })
              .add(
                createDiv({ id: "player-name" }).addText(
                  "h3",
                  params[1].concat(" ", params[0])
                )
              )
              .add(
                createDiv({ id: "player-position" }).addText(
                  "h6",
                  "Year # " + params[2]
                )
              )
              .add(createDiv({ id: "player-number" }).addText("p", "88"))
              .add(
                createDiv({
                  id: "player-following",
                  className: "follow-button",
                }).addText("button", "Follow")
              )
          )
        )
      )
      .add(
        createDiv({ className: "player-body" }).add(
          createDiv({ className: "player-content" }).add(
            createDiv({ id: "player-article" }).setHtml(`
  <h1>Teams</h1>
  
  <h1>1. Profile Overview</h1>
  <pre>
Player Information:
Full Name
Date of Birth
Age
Gender
Position(s): (e.g., Forward, Midfielder, Goalkeeper)
Dominant Foot: (e.g., Right, Left, Both)
Profile Picture: A headshot or action photo.
Contact Information (optional for privacy reasons):
Email
Phone
Short Bio: A brief introduction to the player’s background, goals, and passion for soccer.
</pre>
<h1>2. Teams</h1>
<pre>
Current Team(s):
Team Name
Club/Organization
Coach's Name and Contact
Division/League
Previous Teams:
Team Name
Duration Played
Achievements with the team.
</pre>
<h1>3. Tournaments</h1>
<pre>
Participated Tournaments:
Tournament Name
Year
Location
Division/Level (e.g., State, Regional, National)
Team Performance (e.g., Champion, Runner-up, Group Stage)
Individual Performance (e.g., Goals Scored, MVP Awards)
</pre>
4. Practices and Training
<pre>
Regular Practice Schedule:
Days and Times
Club/Coach Name
Private Training Sessions:
Trainer Name
Focus Areas (e.g., Speed, Agility, Ball Control)
Skill Development:
Specific drills or programs being worked on (e.g., Goalkeeping, Set Pieces).
</pre>
<h1>5. Camps and Clinics</h1>
<pre>
Attended Camps:
Camp Name
Organizer (e.g., Soccer Club, College, Professional Academy)
Duration (e.g., Summer, Winter)
Key Learnings or Feedback Received.
Upcoming Camps:
Planned dates and focus areas.
</pre>
<h1>6. Awards and Achievements</h1>
<pre>
Individual Awards:
MVP Awards
Golden Boot (Top Scorer)
Best Goalkeeper
Player of the Match/Season
Team Achievements:
Championships Won
Significant Milestones (e.g., Unbeaten Seasons)
Academic Awards (if relevant):
Scholar-Athlete Recognition.
</pre>
<h1>7. Badges and Certifications</h1>
<pre>
Skill Badges:
Dribbling
Passing Accuracy
Speed
Leadership
Certifications:
First Aid/CPR
Coaching (if applicable)
Sportsmanship Certifications.
</pre>
<h1>8. Stats and Analytics</h1>
<pre>
Performance Stats:
Matches Played
Goals Scored
Assists
Clean Sheets (for Goalkeepers)
Average Playing Time
Advanced Analytics (if available):
Passing Accuracy (%)
Shots on Target (%)
Defensive Actions (e.g., Tackles, Interceptions)
Heatmaps or GPS Tracking Data.
</pre>
<h1>9. Media and Highlights</h1>
<pre>
Highlight Videos: Links to match footage or skills highlights.
Photos: Action shots from matches, tournaments, and practices.
Press/Media Mentions: Articles or social media posts about the player or team.
</pre>
<h1>10. Development Goals</h1>
<pre>
Short-Term Goals: Specific skills or achievements the player is working on (e.g., improving weak foot, increasing fitness).
Long-Term Goals: Career aspirations (e.g., College Soccer, Professional Level).
</pre>
<h1>11. References</h1>
<pre>
Coach Testimonials: Feedback or letters from coaches about the player’s skills and character.
Peer Reviews: Testimonials from teammates or peers.
</pre>
<h1>12. Additional Sections</h1>
<pre>
Injuries and Recovery: (Optional)
Details about any past injuries and rehabilitation processes.
Community Involvement:
Volunteer work related to soccer (e.g., coaching younger players, organizing events).
Other Interests:
Hobbies or sports outside soccer.
</pre>
  <footer><div class="profile-ownership">
  <p class="ownership-status">Controlled by: <span id="ownership-label">System</span></p>
  <button id="change-ownership" class="ownership-button">Change Ownership</button>
</div></footer>
`)
          )
        )
      );

    return this.renderChild(root);
  }
}
