export interface Story {
  storyid: number
  picture: string
  markerid: number
  time: string
}

export type StoryMap = Map<string, Map<number, string>>
